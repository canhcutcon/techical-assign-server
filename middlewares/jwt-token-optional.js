const { decodeToken } = require("../helpers/jwt");
const Joi = require("../libs/joi");
const verifyJwtToken = async function (req, res) {
  try {
    const tokens = req.headers.authorization.split(" ");
    const verifiedJwt = decodeToken(tokens[1]);
    const userAddress = verifiedJwt.address.toLowerCase();

    if (Joi.assert(userAddress, Joi.ethAddress())) {
      return null;
    }

    return { address: userAddress, id: verifiedJwt?._id };
  } catch (e) {
    return null;
  }
};

module.exports = verifyJwtToken;
