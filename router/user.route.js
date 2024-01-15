const Handler = require("../handlers/user.handler");
const Joi = require("../libs/joi");
const { UserAuthRequest } = require("../helpers/api-handler");

const UserRouter = {};

UserRouter.getUserInfo = UserAuthRequest({
  tags: ["User"],
  description: "Get user info",
  validate: {},
  handler: Handler.getUserInfo,
});

module.exports = UserRouter;
