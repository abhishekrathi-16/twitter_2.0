import { getServerSession } from "next-auth";
import { initMongoose } from "../../lib/mongoose";
import Post from "../../models/Post";
import { authOptions } from "./auth/[...nextauth]";
import Like from "../../models/Like";

export default async function handler(req, res) {
  await initMongoose();
  const session = await getServerSession(req, res, authOptions);

  if (req.method === "GET") {
    const { id } = req.query;
    if (id) {
      const post = await Post.findById(id).populate("author");
      res.json({ post });
    }
    const posts = await Post.find()
      .populate("author")
      .sort({ createdAt: -1 })
      .limit(20)
      .exec();

      const postsLikedByMe = await Like.find({
        author: session?.user?.id, // for posts that are liked by a user
        post: posts.map(p => p._id)  // return array of ids of posts that are liked by the user
      })
      const idslikedByMe = postsLikedByMe.map(like => like.post)

    res.json({
      posts,
      idslikedByMe
    });
  }

  if (req.method === "POST") {
    const { text } = req.body;
    const post = await Post.create({
      author: session.user.id,
      text,
    });
    res.json(post);
  }
}
