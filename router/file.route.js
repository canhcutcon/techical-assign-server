const handler = require("../handlers/file.handle");

const FileRouter = {};

FileRouter.postFileUpload = {
  tags: ["Files"],
  description: "Upload file",
  payload: {
    maxBytes: 1024 * 1024 * 25,
    output: "stream",
    parse: false,
  },
  validate: {
    headers: Joi.object().options({ allowUnknown: true }),
  },
  handler: handler.file,
};

module.exports = FileRouter;
