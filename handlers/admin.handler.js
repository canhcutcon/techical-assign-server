const { ApiResponse: Response, ApiResponse } = require("../helpers");
const { AdminService } = require("../services");
const { getPagination } = require("../helpers/api-request");
const { pagination } = require("../libs/joi");
const handler = {};

handler.login = async (req) => {
  return ApiResponse.success(await AdminService.loginAdmin(req.payload));
};

handler.addMember = async (req) => {
  const { username, password } = req.payload;
  const data = await AdminService.registerAdmin({ username, password });
  return ApiResponse.success(data);
};

handler.updateMember = async (req) => {
  return ApiResponse.success(
    await AdminService.updateAdmin(req.params, req.payload)
  );
};

handler.getListUsers = async (req) => {
  const { page, limit } = getPagination(req.query);
  const { status, type, address, charge } = req.query;
  const filter = {
    status,
    type,
    address,
    charge,
  };
  const { data, total } = await AdminService.getListUsers(filter, {
    page,
    limit,
  });

  return Response.success({
    items: data,
    page,
    limit,
    total,
  });
};

module.exports = handler;
