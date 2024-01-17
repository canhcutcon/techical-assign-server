const { compareSync, hash } = require("bcrypt");
const { UserAdmin } = require("../database/models");
const Exception = require("../helpers/exception");
const config = require("config");
const jwt = require("jsonwebtoken");
const { decodeToken, createToken } = require("../helpers/jwt");
const _this = {};

_this.loginAdmin = async ({ username, password }) => {
  if (!username || !password) return null;
  const admin = await UserAdmin.findOne({
    username: username.toLowerCase(),
  }).lean();

  if (!admin) throw Exception.BadRequest("Invalid username");

  if (!compareSync(password, admin.password)) {
    throw Exception.BadRequest("Invalid password");
  }
  const token = admin.accessToken ? admin.accessToken : createToken(admin);
  delete admin.password;
  await UserAdmin.updateOne(
    { username },
    {
      accessToken: token,
    }
  );
  return { ...admin };
};

_this.getAdmins = async (conditions, pagination, projection = {}) => {
  const { limit, page, skip } = pagination;
  projection = {
    ...projection,
    ...{ _id: 0, createdAt: 0, updatedAt: 0, __v: 0 },
  };

  const [items, total] = await Promise.all([
    UserAdmin.find(conditions, projection).skip(skip).limit(limit).lean(),
    UserAdmin.countDocuments(conditions),
  ]);

  return {
    items,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
};

_this.registerAdmin = async (payload) => {
  const { username, password } = payload;
  return UserAdmin.create({
    username,
    password: await hash(password, 10),
  });
};

_this.updateAdmin = async (condition, payload) => {
  return UserAdmin.updateOne(condition, payload);
};

_this.deleteAdmin = async (condition) => {
  return UserAdmin.deleteOne(condition);
};

module.exports = _this;
