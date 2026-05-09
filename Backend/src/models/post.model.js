const mongoose=require('mongoose');

const postSchema=new mongoose.Schema({
    title:String,
    description:String,
    image:String,
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'user' }],
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'comment' }]
}, { timestamps: true })

const PostModel=mongoose.model("post",postSchema);

module.exports=PostModel;
