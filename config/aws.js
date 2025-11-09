import AWS from "aws-sdk";
import { env } from "./env.js";

export const s3 = new AWS.S3({
  accessKeyId: env.awsAccessKeyId,
  secretAccessKey: env.awsSecretAccessKey,
  region: env.awsRegion,
});
