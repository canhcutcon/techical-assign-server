const Boom = require("boom");

const Exception = {};

Exception.BadRequest = (message, data = null) => Boom.badRequest(message, data);

Exception.InternalError = (message, data = null) => Boom.internal(message, data);

Exception.NotFound = (message, data = null) => Boom.notFound(message, data);

Exception.Forbidden = (message, data = null) => Boom.forbidden(message, data);

module.exports = Exception;
