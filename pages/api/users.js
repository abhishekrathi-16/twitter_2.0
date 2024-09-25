import { getServerSession } from "next-auth";
import { initMongoose } from "../../lib/mongoose";
import { authOptions } from "./auth/[...nextauth]";
import User from "../../models/User";

export default async function handle(req, res) {
  await initMongoose();

  const session = await getServerSession(req, res, authOptions);

  if (req.method === "PUT") {
    const { username } = req.body;
    await User.findByIdAndUpdate(session.user.id, { username });
    res.json("ok");
  }
  if (req.method === "GET") {
    const { id, username } = req.query;
    const user = id
                ? await User.findById(id)
                : await User.findOne({ username });
    res.json({ user });
  }
}
