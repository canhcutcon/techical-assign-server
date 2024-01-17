import config from "config";
import AWS from "aws-sdk";
import Boom from "boom";

const randomString = (numberCharacter) => {
  return `${ethers.hexlify(ethers.randomBytes(numberCharacter)).toUpperCase()}`;
};
const FILE_TYPE_MATCH = [
  "image/png",
  "image/jpeg",
  "image/jpg",
  "image/gif",
  "video/mp3",
  "video/mp4",
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-powerpoint",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  "application/vnd.rar",
  "application/zip",
];

const s3 = new AWS.S3({
  accessKeyId: config.aws.access_key_id,
  secretAccessKey: config.aws.secret_access_key,
});

const uploadFile = async (file) => {
  const filePath = `${randomString(4)}-${new Date().getTime()}-${
    file.filename || file?.originalName
  }`;

  if (FILE_TYPE_MATCH.indexOf(file.mimetype) === -1) {
    throw Boom.badRequest(`${file.filename || file?.originalName} is invalid!`);
  }

  const uploadParams = {
    Bucket: config.aws.bucket_name,
    Body: file?.buffer,
    Key: filePath,
    ContentType: file?.mimetype,
  };

  try {
    await s3.upload(uploadParams).promise();
    const fileName = `${config.aws.cloud_front_url}${filePath}`;
    return fileName;
  } catch (err) {
    console.log("err: ", err);
    throw new Error("Upload file Aws S3 failed");
  }
};
module.exports = {
  uploadFile,
};
