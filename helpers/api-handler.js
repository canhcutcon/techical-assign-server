const verifyJwtToken = require("../middlewares/jwt-token");
const verifyJwtTokenAdmin = require("../middlewares/jwt-token-admin");
const { exceptionCapture } = require("./exception-capture");

const ApiHandler = {};

ApiHandler.setSwaggerTagAndExceptionCapture = function (router) {
  const tags = ["api"];
  if (router?.config) {
    router.config.tags = tags.concat(router.config.tags || []);
    router.config.handler = exceptionCapture(router.config.handler);
  } else {
    router.handler = exceptionCapture(router.handler);
  }

  return router;
};

const applyPreFunction = (config, method, assign) => {
  const pre = { method, assign };
  if (!config.pre) {
    config.pre = [pre];
  } else {
    config.pre.push(pre);
  }
};

ApiHandler.UserAuthRequest = (config) => {
  config.auth = "jwt";
  applyPreFunction(config, verifyJwtToken, "user");
  return config;
};

ApiHandler.AdminAuthRequest = (config) => {
  applyPreFunction(config, verifyJwtTokenAdmin, "isAdmin");
  return config;
};
module.exports = ApiHandler;
