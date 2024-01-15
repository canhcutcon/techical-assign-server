/* eslint-disable no-process-exit */
"use strict";
require("dotenv").config();
const config = require("config");
const JwtConfig = config.get("jwt");
const Routes = require("./router");
const Manifest = require("./config/manifest");
const plugins = require("./config/plugins");
const Glue = require("@hapi/glue");
const mongoose = require("mongoose");
const { connectMongo, listenMongoEvents } = require("./database");

const rootRoute = {
  method: "GET",
  path: "/",
  handler: async (request, h) => {
    return h.response("api-server").code(200);
  },
};

const init = async () => {
  const options = {
    relativeTo: __dirname,
  };
  const registerOptions = { once: true };
  try {
    const server = await Glue.compose(Manifest, options);
    await server.register(plugins, registerOptions);
    server.auth.strategy("jwt", "jwt", {
      key: JwtConfig.secret,
      validate: () => {
        return { isValid: true };
      },
      verifyOptions: {
        algorithms: ["HS256"],
      },
    });

    server.ext("onPreResponse", (request, h) => {
      const response = request.response;
      if (response.isBoom) {
        const payload = response.output.payload;
        if (payload.statusCode === 400 && payload.error === "Bad Request") {
          console.error("ValidationError", payload.message);
        }
      }

      return h.continue;
    });

    server.route(rootRoute);

    server.route(Routes);

    await server.start().then(() => {
      connectMongo();
      listenMongoEvents();
    });

    console.info(`Server running on ${server.info.uri}`);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

process.on("SIGINT", function () {
  mongoose.connection.close(function () {
    console.log(
      "Mongoose default connection is disconnected due to application termination"
    );
  });
});

init();
