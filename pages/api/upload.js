import multiparty from "multiparty";
import S3 from "aws-sdk/clients/s3";
import fs from "fs";
import User from "../../models/User";
import { getServerSession } from "next-auth";
import { authOptions } from "./auth/[...nextauth]";
import { initMongoose } from "../../lib/mongoose";

export default async function handle(req, res) {
  await initMongoose();

  const session = await getServerSession(req, res, authOptions);
  const s3Client = new S3({
    region: "us-west-2",
    credentials: {
      accessKeyId: process.env.S3_ACCESS_KEY,
      secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
    },
  });

  const form = new multiparty.Form({
    uploadDir: "./public",
  });
  form.parse(req, async (err, fields, files) => {
    if (err) {
      throw err;
    }
    const fileInfo = files["cover"][0];
    const fileName = fileInfo.path.split("/")[1];
    s3Client.upload(
      {
        Bucket: "abhi-twitter-clone",
        Body: fs.readFileSync(fileInfo.path),
        ACL: "public-read",
        Key: fileName,
        ContentType: fileInfo.headers["content-type"],
      },
      async (err, data) => {
        const user = await User.findByIdAndUpdate(session.user.id, {
          cover: data.Location,
        });
        res.json({ err, data, fileInfo, src: data.Location });
      }
    );
  });
}

export const config = {
  api: {
    bodyParser: false,
  },
};