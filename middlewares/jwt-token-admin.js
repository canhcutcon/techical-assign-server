const Boom = require("boom");
const { UserAdmin } = require("../database/models");
const { decodeToken } = require("../helpers/jwt");

const verifyJwtTokenAdmin = async function (req, res) {
  try {
    const tokens = req.headers.authorization.split(" ");
    const verifiedJwt = decodeToken(tokens[1]);
    // check existed user
    if (verifiedJwt?.username) {
      const admin = await UserAdmin.findOne({ username: verifiedJwt.username }).select("accessToken");
      if (tokens[1] !== admin?.accessToken) {
        return Boom.unauthorized("Invalid Token");
      }
    }
    if (verifiedJwt?.scope && verifiedJwt?.scope === "admin") {
      return true;
    }
    return Boom.unauthorized("Invalid Token");
  } catch (e) {
    return Boom.unauthorized("Invalid Token");
  }
};

module.exports = verifyJwtTokenAdmin;
