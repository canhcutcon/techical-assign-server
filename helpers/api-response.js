const Boom = require("boom");

const ApiResponse = {};

ApiResponse.success = (data) => {
  return {
    message: "Success",
    statusCode: 200,
    data,
  };
};

ApiResponse.badRequest = (message, data) => Boom.badRequest(message, data);

ApiResponse.internalError = (message, data) => Boom.internal(message, data);

ApiResponse.notFound = (message) => Boom.notFound(message, null);

ApiResponse.forbidden = (message) => Boom.forbidden(message, null);

module.exports = ApiResponse;
