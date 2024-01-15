const Boom = require("boom");
const { decodeToken } = require("../helpers/jwt");
const Joi = require("../libs/joi");
const { UserService } = require("../services");
const verifyJwtToken = async function (req, res) {
  try {
    let token = null;
    if (req.headers.authorization) {
      token = req.headers.authorization.split(" ")[1];
    }
    const verifiedJwt = decodeToken(token);
    const username = verifiedJwt.username.toLowerCase();

    // check user is still a member
    const isMember = await UserService.findOne({ username });
    if (!isMember) return Boom.unauthorized("username is not member");
    return { username: username, _id: verifiedJwt._id };
  } catch (e) {
    console.error(e);
    return Boom.unauthorized("Invalid Token");
  }
};

module.exports = verifyJwtToken;
