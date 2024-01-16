const Handler = require("../handlers/admin.handler");
const Joi = require("../libs/joi");
const { AdminAuthRequest } = require("../helpers/api-handler");
const AdminRouter = {};

AdminRouter.login = {
  tags: ["Admin"],
  description: "Admin login",
  validate: {
    payload: Joi.object({
      username: Joi.string().required().description("Admin's username"),
      password: Joi.string().required().description("Admin's password"),
    }),
  },
  handler: Handler.login,
};

AdminRouter.addMember = {
  tags: ["Admin"],
  description: "Admin add member",
  validate: {
    payload: Joi.object({
      username: Joi.string().required().description("Admin's username"),
      password: Joi.string().required().description("Admin's password"),
    }),
  },
  handler: Handler.addMember,
};

// AdminRouter.updateMember = AdminAuthRequest({
//   tags: ["Admin"],
//   description: "Admin update member",
//   validate: {
//     params: Joi.object({
//       id: Joi.objectId().required(),
//     }),
//     payload: Joi.object({
//       username: Joi.string().allow(""),
//     }),
//   },
//   handler: Handler.updateMember,
// });

// AdminRouter.getListUsers = AdminAuthRequest({
//   tags: ["Admin"],
//   description: "Admin get list members",
//   validate: {
//     query: Joi.object(
//       Joi.pagination({
//         status: Joi.string()
//           .valid(USER_STATUS_ACTIVE, USER_STATUS_BLOCKED)
//           .optional(),
//         type: Joi.string().valid(USER_TRIAL, USER_MEMBER, USER_VIP).optional(),
//         address: Joi.string().optional(),
//         charge: Joi.string().valid("null", CHARGE_PENDING, CHARGE_SUCCESS),
//       })
//     ),
//   },
//   handler: Handler.getListUsers,
// });

module.exports = AdminRouter;
