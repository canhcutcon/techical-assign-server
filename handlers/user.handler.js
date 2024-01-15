const { UserService, AdminService, AuthService } = require("../services");
const { ApiResponse: Response, ApiResponse } = require("../helpers");
const { getPagination } = require("../helpers/api-request");
const handler = {};

handler.login = async (req) => {
  const data = await AuthService.login(req.payload);
  return ApiResponse.success(data);
};

handler.register = async (req) => {
  const data = await AuthService.register(req.payload);
  return ApiResponse.success(data);
};

handler.changePassword = async (req) => {
  const data = await AuthService.changePassword(req.user, req.payload);
  return ApiResponse.success(data);
};

handler.getUserInfo = async (req) => {
  const data = await UserService.findOne({ _id: req.pre.user._id });
  return ApiResponse.success(data);
};

module.exports = handler;
