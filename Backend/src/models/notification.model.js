const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    recipient: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'user', 
        required: true 
    },
    sender: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'user', 
        required: true 
    },
    type: { 
        type: String, 
        enum: ['like', 'comment', 'follow', 'message'], 
        required: true 
    },
    post: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'post' 
    },
    reel: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'reel' 
    },
    text: { 
        type: String 
    },
    isRead: { 
        type: Boolean, 
        default: false 
    }
}, {
    timestamps: true
});

const NotificationModel = mongoose.model('Notification', notificationSchema);
module.exports = NotificationModel;
