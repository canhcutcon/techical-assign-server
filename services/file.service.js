const _this = {};
const { uploadFile } = require("../helpers/aws");
const fs = require("fs");
const multiparty = require("multiparty");

_this.upload = async (req) => {
  return new Promise((resolve, reject) => {
    const form = new multiparty.Form();

    form.parse(req.payload, async function (err, fields, files) {
      if (err) {
        console.error(err.message);
        return reject(err); // Reject the promise on error
      }

      const filePath = files.file[0]?.path;
      const mimetype = files.file[0]?.headers["content-type"];
      const uploadedFile = fs.readFileSync(filePath);
      const buffer = Buffer.from(uploadedFile);
      try {
        const result = await uploadFile({ ...uploadedFile, buffer, mimetype });
        resolve({
          url: result,
        });
      } catch (uploadError) {
        console.error(uploadError.message);
        reject(uploadError); // Reject the promise on upload error
      }
    });
  });
};

module.exports = _this;
