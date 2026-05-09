const express = require('express');
const cors = require('cors');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
// Models
const PostModel = require('./models/post.model'); 
const UserModel = require('./models/user.model');
const CommentModel = require('./models/comment.model');
const NotificationModel = require('./models/notification.model');
const ReelModel = require('./models/reel.model');
const MessageModel = require('./models/message.model');
const ConversationModel = require('./models/conversation.model');

const createAndEmitNotification = async (req, recipientId, senderId, type, text, additionalData = {}) => {
    if (recipientId.toString() === senderId.toString()) return; // Don't notify self
    try {
        const notif = await NotificationModel.create({
            recipient: recipientId,
            sender: senderId,
            type: type,
            text: text,
            ...additionalData
        });
        const populated = await NotificationModel.findById(notif._id).populate('sender', 'username imageUrl clerkId');
        const recipient = await UserModel.findById(recipientId);
        if (req.app.get('io') && recipient) {
            req.app.get('io').to(recipient.clerkId).emit('receive_notification', populated);
        }
    } catch (err) { console.error("Notification Error:", err); }
};

const uploadFile = require('./services/storage.service');

const app = express();
app.use(cors());
app.use(express.json());

// Configure Disk Storage for handling large video files
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, 'uploads'));
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const upload = multer({ storage: storage });

app.get("/", (req, res) => {
    res.send("API is running");
});

// Get all users (for Chat/Follow contacts)
app.get('/api/users', async (req, res) => {
    try {
        const { clerkId, followingOnly } = req.query;
        let query = {};

        if (followingOnly === 'true' && clerkId) {
            const user = await UserModel.findOne({ clerkId });
            if (user && user.following && user.following.length > 0) {
                query = { _id: { $in: user.following } };
            } else {
                // If they follow no one, return empty
                return res.status(200).json({ users: [] });
            }
        }

        const users = await UserModel.find(query, 'username imageUrl clerkId _id');
        res.status(200).json({ users });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// User Sync Webhook (for Clerk)
app.post('/api/users/sync', async (req, res) => {
    try {
        const { clerkId, username, imageUrl } = req.body;
        // Upsert user
        const user = await UserModel.findOneAndUpdate(
            { clerkId },
            { username, imageUrl },
            { new: true, upsert: true }
        );
        res.status(200).json({ message: "User synced", user });
    } catch (err) {
        res.status(500).json({ message: "Error syncing user", error: err.message });
    }
});

// Posts
app.post('/create-post', upload.single('image'), async (req, res) => {
    try {
        const data = req.body;
        let imageUrl = null;

        if (req.file) {
            const result = await uploadFile(req.file.buffer);
            imageUrl = result.url;
        }

        let authorId = null;
        if (data.clerkId) {
            const user = await UserModel.findOne({ clerkId: data.clerkId });
            if (user) authorId = user._id;
        }

        const post = await PostModel.create({
            title: data.title || '',
            description: data.description,
            image: imageUrl,
            author: authorId
        });

        res.status(201).json({ message: "Post created successfully", post });
    } catch (err) {
        res.status(500).json({ message: "Error creating post", error: err.message });
    }
});

app.get('/posts', async (req, res) => {
    try {
        const { feed, clerkId } = req.query;
        let query = {};

        if (feed === 'following' && clerkId) {
            const user = await UserModel.findOne({ clerkId });
            if (user && user.following && user.following.length > 0) {
                query = { author: { $in: user.following } };
            } else if (user && (user.following || []).length === 0) {
                // Return empty if they follow no one
                return res.status(200).json({ message: "Posts retrieved successfully", posts: [] });
            }
        }

        const posts = await PostModel.find(query)
            .populate('author', 'username imageUrl _id clerkId')
            .populate('likes', '_id username')
            .populate({
                path: 'comments',
                populate: { path: 'author', select: 'username imageUrl' }
            })
            .sort({ createdAt: -1 });

        res.status(200).json({ message: "Posts retrieved successfully", posts });
    } catch (err) {
        res.status(500).json({ message: "Error retrieving posts", error: err.message });
    }
});

// Likes
app.post('/api/posts/:id/like', async (req, res) => {
    try {
        const postId = req.params.id;
        const { clerkUserId } = req.body;

        const user = await UserModel.findOne({ clerkId: clerkUserId });
        if (!user) return res.status(404).json({ message: "User not found" });

        const post = await PostModel.findById(postId);
        if (!post) return res.status(404).json({ message: "Post not found" });

        const likeIndex = post.likes.indexOf(user._id);
        if (likeIndex > -1) {
            post.likes.splice(likeIndex, 1);
        } else {
            post.likes.push(user._id);
            await createAndEmitNotification(req, post.author, user._id, 'like', `${user.username} liked your post.`, { post: post._id });
        }
        await post.save();

        res.status(200).json({ message: "Like updated", post });
    } catch (err) {
        res.status(500).json({ message: "Error updating like", error: err.message });
    }
});

// Comments
app.post('/api/posts/:id/comments', async (req, res) => {
    try {
        const postId = req.params.id;
        const { text, clerkUserId } = req.body;

        const user = await UserModel.findOne({ clerkId: clerkUserId });
        if (!user) return res.status(404).json({ message: "User not found" });

        const comment = await CommentModel.create({
            text,
            author: user._id,
            post: postId
        });

        const post = await PostModel.findById(postId);
        post.comments.push(comment._id);
        await post.save();

        await createAndEmitNotification(req, post.author, user._id, 'comment', `${user.username} commented on your post.`, { post: post._id });

        res.status(201).json({ message: "Comment added", comment });
    } catch (err) {
        res.status(500).json({ message: "Error adding comment", error: err.message });
    }
});

// Follow User
app.post('/api/users/:targetId/follow', async (req, res) => {
    try {
        const { targetId } = req.params; // MongoDB _id of target user
        const { clerkUserId } = req.body; // Clerk ID of actor

        const currentUser = await UserModel.findOne({ clerkId: clerkUserId });
        if (!currentUser) return res.status(404).json({ message: "Current user not found" });

        const targetUser = await UserModel.findById(targetId);
        if (!targetUser) return res.status(404).json({ message: "Target user not found" });

        const isFollowing = currentUser.following.includes(targetUser._id);

        if (isFollowing) {
            currentUser.following.pull(targetUser._id);
            targetUser.followers.pull(currentUser._id);
        } else {
            currentUser.following.push(targetUser._id);
            targetUser.followers.push(currentUser._id);
            await createAndEmitNotification(req, targetUser._id, currentUser._id, 'follow', `${currentUser.username} started following you.`);
        }

        await currentUser.save();
        await targetUser.save();

        res.status(200).json({ message: "Follow status updated", isFollowing: !isFollowing });
    } catch (err) {
        res.status(500).json({ message: "Error updating follow", error: err.message });
    }
});

// Get User Profile
app.get('/api/users/:clerkId', async (req, res) => {
    try {
        const user = await UserModel.findOne({ clerkId: req.params.clerkId });
        if (!user) return res.status(404).json({ message: "User not found" });

        const posts = await PostModel.find({ author: user._id })
            .populate('author', 'username imageUrl _id clerkId')
            .populate('likes', '_id username')
            .populate({ path: 'comments', populate: { path: 'author', select: 'username imageUrl' } })
            .sort({ createdAt: -1 });

        // ReelModel is imported at the top
        const reels = await ReelModel.find({ creator: user._id })
            .populate('creator', 'username imageUrl _id clerkId')
            .sort({ createdAt: -1 });

        res.status(200).json({ user, posts, reels });
    } catch (err) {
        res.status(500).json({ message: "Error fetching user", error: err.message });
    }
});

// Reels Upload handler below

app.post('/api/reels/upload', upload.single('video'), async (req, res) => {
    const filePath = req.file ? req.file.path : null;
    try {
        const { caption, clerkUserId } = req.body;
        console.log(`[ReelUpload] Received request from: ${clerkUserId}`);

        const user = await UserModel.findOne({ clerkId: clerkUserId });
        if (!user) {
            if (filePath) fs.unlinkSync(filePath); // Cleanup on early exit
            return res.status(404).json({ message: "User not found" });
        }

        let videoUrl = null;
        if (filePath) {
            console.log(`[ReelUpload] Uploading ${req.file.size} bytes from disk to ImageKit...`);
            // Pass the filePath to the uploadFile service
            const result = await uploadFile(filePath, req.file.filename);
            videoUrl = result.url;
            console.log(`[ReelUpload] ImageKit success: ${videoUrl}`);

            // Delete local file after successful upload
            fs.unlinkSync(filePath);
        } else {
            return res.status(400).json({ message: "No video file provided" });
        }

        const reel = await ReelModel.create({
            creator: user._id,
            videoUrl: videoUrl,
            caption: caption
        });

        res.status(201).json({ message: "Reel uploaded", reel });
    } catch (err) {
        console.error(`[ReelUpload] Error:`, err.message);
        if (filePath && fs.existsSync(filePath)) fs.unlinkSync(filePath); // Ensure cleanup on crash
        res.status(500).json({ message: "Error uploading reel", error: err.message });
    }
});

// Get Reels Feed
app.get('/api/reels', async (req, res) => {
    try {
        const reels = await ReelModel.find()
            .populate('creator', 'username imageUrl _id clerkId')
            .populate('likes', '_id username')
            .sort({ createdAt: -1 });
        res.status(200).json({ reels });
    } catch (err) {
        res.status(500).json({ message: "Error fetching reels", error: err.message });
    }
});

// Like Reel
app.post('/api/reels/:id/like', async (req, res) => {
    try {
        const reelId = req.params.id;
        const { clerkUserId } = req.body;

        const user = await UserModel.findOne({ clerkId: clerkUserId });
        if (!user) return res.status(404).json({ message: "User not found" });

        const reel = await ReelModel.findById(reelId);
        if (!reel) return res.status(404).json({ message: "Reel not found" });

        const likeIndex = reel.likes.indexOf(user._id);
        if (likeIndex > -1) {
            reel.likes.splice(likeIndex, 1);
        } else {
            reel.likes.push(user._id);
            await createAndEmitNotification(req, reel.creator, user._id, 'like', `${user.username} liked your reel.`, { reel: reel._id });
        }
        await reel.save();

        res.status(200).json({ message: "Like updated", reel });
    } catch (err) {
        res.status(500).json({ message: "Error updating like", error: err.message });
    }
});

// Message handlers below
app.get('/api/messages/:userId', async (req, res) => {
    try {
        const currentUserClerkId = req.query.clerkId;
        const currentUser = await UserModel.findOne({ clerkId: currentUserClerkId });
        if (!currentUser) return res.status(404).json({ message: "User not found" });

        const targetUserId = req.params.userId;

        // Find conversation containing both users
        const conversation = await ConversationModel.findOne({
            participants: { $all: [currentUser._id, targetUserId] }
        });

        if (!conversation) {
            return res.status(200).json({ messages: [] });
        }

        const messages = await MessageModel.find({ conversation: conversation._id })
            .populate('sender', 'username imageUrl clerkId')
            .sort({ createdAt: 1 });

        res.status(200).json({ messages });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Create or get conversation
app.post('/api/conversations', async (req, res) => {
    try {
        const { clerkId, targetUserId } = req.body;
        const currentUser = await UserModel.findOne({ clerkId });

        let conversation = await ConversationModel.findOne({
            participants: { $all: [currentUser._id, targetUserId] }
        });

        if (!conversation) {
            conversation = await ConversationModel.create({
                participants: [currentUser._id, targetUserId]
            });
        }

        res.status(200).json({ conversation });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- Notifications ---
app.get('/api/notifications/:clerkId', async (req, res) => {
    try {
        const user = await UserModel.findOne({ clerkId: req.params.clerkId });
        if (!user) return res.status(404).json({ message: "User not found" });

        const notifications = await NotificationModel.find({ recipient: user._id })
            .populate('sender', 'username imageUrl clerkId')
            .sort({ createdAt: -1 });

        res.status(200).json({ notifications });
    } catch (err) {
        res.status(500).json({ message: "Error fetching notifications", error: err.message });
    }
});

app.put('/api/notifications/:id/read', async (req, res) => {
    try {
        const notification = await NotificationModel.findByIdAndUpdate(req.params.id, { isRead: true }, { new: true });
        res.status(200).json({ notification });
    } catch (err) {
        res.status(500).json({ message: "Error updating notification", error: err.message });
    }
});

// --- Save / Bookmark ---

// Toggle save post
app.post('/api/posts/:id/save', async (req, res) => {
    try {
        const { clerkUserId } = req.body;
        const user = await UserModel.findOne({ clerkId: clerkUserId });
        if (!user) return res.status(404).json({ message: "User not found" });

        const postId = req.params.id;
        const idx = user.savedPosts.indexOf(postId);
        if (idx > -1) {
            user.savedPosts.splice(idx, 1);
        } else {
            user.savedPosts.push(postId);
        }
        await user.save();
        res.status(200).json({ message: "Save updated", isSaved: idx === -1, savedPosts: user.savedPosts });
    } catch (err) {
        res.status(500).json({ message: "Error saving post", error: err.message });
    }
});

// Toggle save reel
app.post('/api/reels/:id/save', async (req, res) => {
    try {
        const { clerkUserId } = req.body;
        const user = await UserModel.findOne({ clerkId: clerkUserId });
        if (!user) return res.status(404).json({ message: "User not found" });

        const reelId = req.params.id;
        const idx = user.savedReels.indexOf(reelId);
        if (idx > -1) {
            user.savedReels.splice(idx, 1);
        } else {
            user.savedReels.push(reelId);
        }
        await user.save();
        res.status(200).json({ message: "Save updated", isSaved: idx === -1, savedReels: user.savedReels });
    } catch (err) {
        res.status(500).json({ message: "Error saving reel", error: err.message });
    }
});

// Get saved posts
app.get('/api/saved/posts/:clerkId', async (req, res) => {
    try {
        const user = await UserModel.findOne({ clerkId: req.params.clerkId })
            .populate({
                path: 'savedPosts',
                populate: [
                    { path: 'author', select: 'username imageUrl _id clerkId' },
                    { path: 'likes', select: '_id username' },
                    { path: 'comments', populate: { path: 'author', select: 'username imageUrl' } }
                ]
            });
        if (!user) return res.status(404).json({ message: "User not found" });
        res.status(200).json({ posts: user.savedPosts || [] });
    } catch (err) {
        res.status(500).json({ message: "Error fetching saved posts", error: err.message });
    }
});

// Get saved reels
app.get('/api/saved/reels/:clerkId', async (req, res) => {
    try {
        const user = await UserModel.findOne({ clerkId: req.params.clerkId })
            .populate({
                path: 'savedReels',
                populate: [
                    { path: 'creator', select: 'username imageUrl _id clerkId' },
                    { path: 'likes', select: '_id username' }
                ]
            });
        if (!user) return res.status(404).json({ message: "User not found" });
        res.status(200).json({ reels: user.savedReels || [] });
    } catch (err) {
        res.status(500).json({ message: "Error fetching saved reels", error: err.message });
    }
});

// Get user's saved IDs (for quick checking on frontend)
app.get('/api/saved/:clerkId', async (req, res) => {
    try {
        const user = await UserModel.findOne({ clerkId: req.params.clerkId });
        if (!user) return res.status(404).json({ message: "User not found" });
        res.status(200).json({ savedPosts: user.savedPosts || [], savedReels: user.savedReels || [] });
    } catch (err) {
        res.status(500).json({ message: "Error fetching saved items", error: err.message });
    }
});

module.exports = app;