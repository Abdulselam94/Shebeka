import multer from "multer";
import multerS3 from "multer-s3";
import { s3 } from "../config/aws.js";
import { env } from "../config/env.js";

export const upload = multer({
  storage: multerS3({
    s3,
    bucket: env.s3Bucket,
    acl: "public-read",
    key: (req, file, cb) => {
      cb(null, `${Date.now()}-${file.originalname}`);
    },
  }),
});
