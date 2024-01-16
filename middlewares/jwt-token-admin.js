const Boom = require("boom");
const { UserAdmin } = require("../database/models");
const { decodeToken } = require("../helpers/jwt");

const verifyJwtTokenAdmin = async function (req, res) {
  try {
    let token = null;
    if (req.headers.authorization) {
      token = req.headers.authorization.split(" ")[1];
    }
    const verifiedJwt = decodeToken(token);
    const username = verifiedJwt.username.toLowerCase();

    const isMember = await UserAdmin.findOne({ username });
    if (!isMember) return Boom.unauthorized("username is not member");

    return { username: username, _id: verifiedJwt._id };
  } catch (e) {
    console.error(e);
    return Boom.unauthorized("Invalid Token");
  }
};

module.exports = verifyJwtTokenAdmin;
