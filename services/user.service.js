const { User } = require("../database/models");

const _this = {};

_this.findOne = async (conditions = {}, projections = {}) => {
  return await User.findOne(conditions, projections).lean();
};

module.exports = _this;
