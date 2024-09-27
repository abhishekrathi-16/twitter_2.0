import { getServerSession } from "next-auth";
import { initMongoose } from "../../lib/mongoose";
import { authOptions } from "./auth/[...nextauth]";
import Follower from "../../models/Follower";

export default async function handler(req, res) {
  await initMongoose();
  const session = await getServerSession(req, res, authOptions);
  const { destination } = req.body;

  const existingFollower = await Follower.findOne({ destination, source: session.user.id });
  if(existingFollower){
    await existingFollower.deleteOne();
    res.json(null)
  }else{
    const follower = await Follower.create({ destination, source: session.user.id });
    res.json(follower)
  }
}
