"use strict";
const config = require("config");
const Boom = require("boom");

const Environment = config.get("env");
const Port = 3011;

const manifest = {
  server: {
    router: {
      isCaseSensitive: false,
      stripTrailingSlash: true,
    },
    port: Port,
    routes: {
      cors: {
        additionalHeaders: [
          "user-device-id",
          "country-code",
          "country-name",
          "coords",
        ],
      },
      validate: {
        failAction: async (request, h, err) => {
          console.error("Catch in failAction hook", err);
          if (Environment === "production") {
            throw Boom.badRequest("Invalid request payload input");
          } else {
            throw err;
          }
        },
      },
    },
  },
};
module.exports = manifest;
