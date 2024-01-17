const _this = {};
const { uploadFile } = require("../helpers/aws");
const fs = require("fs");

_this.upload = async (req) => {
  const files = req?.payload?.file;
  const imageLink = [];

  if (files.length) {
    for (const file of files) {
      const filePath = file.path;
      const mimetype = file?.headers["content-type"];
      const uploadedFile = fs.readFileSync(filePath);
      const buffer = Buffer.from(uploadedFile);
      imageLink.push(uploadFile({ ...file, buffer, mimetype }));
    }
  }

  return imageLink;
};
module.exports = _this;
