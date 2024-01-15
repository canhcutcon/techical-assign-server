const { ApiResponse: Response } = require("../helpers");
const { AdminService } = require("../services");
const { getPagination } = require("../helpers/api-request");
const handler = {};

handler.login = async (req) => {
  return AdminService.login(req.payload.username, req.payload.password);
};

handler.addMember = async (req) => {
  const { username, password } = req.payload;
  return AdminService.registerAdmin({ username, password });
};

handler.updateMember = async (req) => {
  return AdminService.updateMember(req.params.id, req.payload);
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
  return Response.Paginate(data, total, page, limit);
};

module.exports = handler;
