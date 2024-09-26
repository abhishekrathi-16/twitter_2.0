import { getServerSession } from "next-auth";
import { initMongoose } from "../../lib/mongoose";
import { authOptions } from "./auth/[...nextauth]";
import User from "../../models/User";

export default async function (req, res) {
  await initMongoose();
  const session = await getServerSession(req, res, authOptions);
  const { bio, name, username } = req.body;
  await User.findByIdAndUpdate(session.user.id, { bio, name, username });
  res.json('ok');
}
