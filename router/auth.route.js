const handler = require("../handlers/user.handler");
const Joi = require("../libs/joi");

const AuthRouter = {};

AuthRouter.login = {
  tags: ["Users Authentication"],
  description: "Login",
  validate: {
    payload: Joi.object({
      username: Joi.string().required().description("Username"),
      password: Joi.string().required().description("Password"),
    }),
  },
  handler: handler.login,
};

AuthRouter.register = {
  tags: ["Users Authentication"],
  description: "User Register",
  validate: {
    payload: Joi.object({
      username: Joi.string().required().description("Username"),
      password: Joi.string().required().description("Password"),
      email: Joi.string().required().description("Email"),
    }),
  },
  handler: handler.register,
};

module.exports = AuthRouter;
