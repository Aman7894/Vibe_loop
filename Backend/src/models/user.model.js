const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    clerkId: { type: String, required: true, unique: true },
    username: { type: String, required: true },
    imageUrl: { type: String },
    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'user' }],
    following: [{ type: mongoose.Schema.Types.ObjectId, ref: 'user' }],
    savedPosts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'post' }],
    savedReels: [{ type: mongoose.Schema.Types.ObjectId, ref: 'reel' }]
}, { timestamps: true });

const UserModel = mongoose.model("user", userSchema);
module.exports = UserModel;
