const Boom = require("boom");
const { BadRequest } = require("./exception");

const exceptionCapture = (routeHandler) => {
  return (request, reply) => {
    return routeHandler(request)
      .then((data) => {
        if (data instanceof Boom && data.isBoom) {
          throw data;
        }

        if (data?.noWrap === true) {
          delete data?.noWrap;
          return reply.response(data).code(200);
        }

        const res = {
          data: data?.data || data,
          message: data?.message || "Success",
          statusCode: data?.statusCode || 200,
        };

        return reply.response(res).code(res.statusCode);
      })
      .catch((err) => {
        console.error("Error: ", err);

        if (err instanceof Boom && err.isBoom) {
          throw err;
        }

        checkMongoError(err);

        const res = {
          message: err?.message || "An internal server error occurred",
          error: err?.message || "An internal server error occurred",
          statusCode: err.statusCode || 500,
        };

        return reply.response(res).code(res.statusCode);
      });
  };
};

const checkMongoError = (err) => {
  console.log(err?.code);
  if (err?.code === 11000) {
    throw BadRequest(`This ${Object.keys(err?.keyPattern)?.[0]} already exists in the system.`);
  }
};

module.exports = {
  exceptionCapture,
};
