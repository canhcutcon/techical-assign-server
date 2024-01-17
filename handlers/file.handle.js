const { upload } = require("../services/file.service");
const { ApiResponse } = require("../helpers");
const handler = {};

handler.file = async (req) => {
  const res = await upload(req);
  if (res) return ApiResponse.success(res);
  return ApiResponse.internalError("Fail to upload file");
};

module.exports = handler;
