const config = require("config");
const SwaggerConfig = config.get("Swagger");
const JwtConfig = config.get("jwt");

const plugins = [];
plugins.push({
  plugin: require("hapi-auth-jwt2"),
  options: JwtConfig,
});

if (SwaggerConfig.enable) {
  plugins.push({
    plugin: require("hapi-swagger"),
    options: {
      info: {
        title: SwaggerConfig.options.info.title,
        version: SwaggerConfig.options.info.version,
      },
      schemes: ["http"],
      grouping: "tags",
      securityDefinitions: {
        jwt: {
          type: "apiKey",
          name: "Authorization",
          in: "header",
        },
      },
      security: [{ jwt: [] }],
    },
  });

  if (
    SwaggerConfig.options.documentationPage ||
    SwaggerConfig.options.swaggerUI
  ) {
    plugins.push({
      plugin: require("@hapi/inert"),
    });
    plugins.push({
      plugin: require("@hapi/vision"),
      options: {},
    });
  }
}
plugins.push({
  plugin: require("laabr"),
  options: {
    override: false,
    formats: {
      log: ":level - :message",
      response: ":method, :url, :status, :payload, (:responseTime ms)",
      "request-error":
        // eslint-disable-next-line max-len
        ":method, :url, :payload, :error[output.statusCode], :error, :error[stack]",
      onPostStart: ":level - :message",
      onPostStop: ":level - :message",
    },
    indent: 0,
    colored: true,
    hapiPino: {
      prettyPrint: "development",
      mergeHapiLogData: true,
      ignoreFunc: (options, request) =>
        request.path.startsWith("/assets") ||
        request.path.includes("/favicon") ||
        request.path.includes("/upload/base64-image") ||
        request.path.includes("/upload/review/base64"),
      logPayload: true,
    },
  },
});
module.exports = plugins;
