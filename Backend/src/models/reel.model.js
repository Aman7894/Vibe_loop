const mongoose = require('mongoose');

const reelSchema = new mongoose.Schema({
  creator: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
  videoUrl: { type: String, required: true },
  thumbnailUrl: { type: String },
  caption: { type: String },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'user' }],
  commentsCount: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('reel', reelSchema);
