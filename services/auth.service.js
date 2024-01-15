const config = require("config");
const { UserAdmin, User } = require("../database/models");
const { hash, compareSync } = require("bcrypt");
const Exception = require("../helpers/exception");
const { createToken } = require("../helpers/jwt");
const _this = {};

_this.register = async (payload) => {
  const { username, password, email } = payload;

  if (await User.findOne({ username })) {
    throw Exception.BadRequest("Username already exists");
  }

  const user = await User.create({
    username,
    password: await hash(password, 10),
    email,
  });

  const result = { ...user._doc };
  delete result.password;

  return result;
};

_this.login = async ({ username, password }) => {
  if (!username || !password) return null;
  const user = await User.findOne({
    username: username.toLowerCase(),
  }).lean();

  if (!user) throw Exception.BadRequest("Invalid username");

  if (!compareSync(password, user.password)) {
    throw Exception.BadRequest("Invalid password");
  }

  const token = createToken(user);
  const result = { ...user._doc };

  delete result.password;
  return { ...result, token };
};

_this.changePassword = async (user, payload, isAdmin = false) => {
  const { newPassword } = payload;
  const updatePayload = {
    $set: {
      password: await hash(newPassword, 10),
    },
  };

  const updated = isAdmin
    ? await UserAdmin.findByIdAndUpdate(user._id, updatePayload, {
        new: true,
      }).lean()
    : await User.findByIdAndUpdate(user._id, updatePayload, {
        new: true,
      }).lean();

  const result = { ...updated._doc };
  delete result.password;
};

module.exports = _this;
