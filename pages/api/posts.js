import { getServerSession } from "next-auth";
import { initMongoose } from "../../lib/mongoose";
import Post from "../../models/Post";
import { authOptions } from "./auth/[...nextauth]";
import Like from "../../models/Like";
import Follower from "../../models/Follower";

export default async function handler(req, res) {
  await initMongoose();
  const session = await getServerSession(req, res, authOptions);

  if (req.method === "GET") {
    const { id } = req.query;
    if (id) {
      const post = await Post.findById(id).populate("author").populate({
        path: "parent",
        populate: "author",
      });
      res.json({ post });
    } else {
      const parent = req.query.parent || null;
      const author = req.query.author;
      // const searchFilter = author ? { author } : { parent };
      let searchFilter;
      if (!author && !parent) {
        const myFollowing = await Follower.find({
          source: session.user.id,
        }).exec();
        const peopleIFollow = myFollowing.map(f => f.destination);
        searchFilter = { author: [...peopleIFollow, session.user.id] }; // only show posts from myself and people I follow in the home page
      }

      if (author) {
        searchFilter = { author };
      }
      if (parent) {
        searchFilter = { parent };
      }
      const posts = await Post.find(searchFilter)
        .populate("author")
        .populate({
          path: "parent",
          populate: "author",
        })
        .sort({ createdAt: -1 })
        .limit(20)
        .exec();

      const postsLikedByMe = await Like.find({
        author: session?.user?.id, // for posts that are liked by a user
        post: posts.map((p) => p._id), // return array of ids of posts that are liked by the user
      });
      const idslikedByMe = postsLikedByMe.map((like) => like.post);

      res.json({
        posts,
        idslikedByMe,
      });
    }
  }

  if (req.method === "POST") {
    const { text, parent, images } = req.body;
    const post = await Post.create({
      author: session.user.id,
      text,
      parent,
      images,
    });
    if (parent) {
      const parentPost = await Post.findById(parent);
      parentPost.commentsCount = await Post.countDocuments({ parent });
      await parentPost.save();
    }
    res.json(post);
  }
}
