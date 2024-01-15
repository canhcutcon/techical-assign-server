const { compareSync } = require("bcrypt");
const { UserAdmin } = require("../database/models");
const Exception = require("../helpers/exception");
const config = require("config");
const jwt = require("jsonwebtoken");
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
  if (admin.accessToken) {
    // check access token expired
    const decodedToken = jwt.verify(
      admin.accessToken,
      config.jwt.secret,
      function (err, decoded) {
        if (err) {
          return null;
        }
        return decoded;
      }
    );
    if (decodedToken === null) {
      admin.accessToken = "";
    }
  }
  const token = admin.accessToken
    ? admin.accessToken
    : jwt.sign(
        {
          _id: admin._id,
          username: admin.username,
        },
        config.jwt.secret,
        {
          algorithm: "HS256",
          expiresIn: config.jwt.expiredIn,
        }
      );
  delete admin.password;
  delete admin.accessToken;
  if (!admin.isPartner) {
    await UserAdmin.updateOne(
      {
        username: username.toLowerCase(),
      },
      { accessToken: token }
    ).exec();
  }
  return { ...admin, token };
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
  return UserAdmin.create({
    ...payload,
  });
};

_this.updateAdmin = async (condition, payload) => {
  return UserAdmin.updateOne(condition, payload);
};

_this.deleteAdmin = async (condition) => {
  return UserAdmin.deleteOne(condition);
};

module.exports = _this;
