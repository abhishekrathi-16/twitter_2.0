import mongoose, { model, models, Schema } from "mongoose";

const PostSchema = new Schema(
  {
    author: { type: mongoose.Types.ObjectId, ref: "User" },
    text: String,
    likesCount: { type: Number, default: 0 },
    commentsCount: {type: Number, default: 0},
    parent: { type: mongoose.Types.ObjectId, ref: "Post" }, // if the post is on the home page, it will not have any parent,ie, parent will be null but if it is a reply on a post, it will have a parent
  },
  {
    timestamps: true,
  }
);

const Post = models?.Post || model("Post", PostSchema);
export default Post;
