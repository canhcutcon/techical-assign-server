const Boom = require("boom");

const verifyUserAgent = async function (req, res) {
  try {
    const userAgent = req.headers["user-agent"]?.toLowerCase();
    if (
      userAgent.match(
        /chrome|chromium|crios|firefox|fxios|safari|opr|edg|metamask/i
      )
    ) {
      return true;
    }

    return Boom.badRequest("Invalid Request");
  } catch (e) {
    console.error(e);
    return Boom.unauthorized("Invalid Token");
  }
};

module.exports = verifyUserAgent;
