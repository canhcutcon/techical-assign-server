const Boom = require("boom");
const { decrypt } = require("../helpers/payload-encode");
const config = require("config");
const CipherKey = config.get("PayloadCipherKey") || "";

const verifyEncryptedPayload = async function (req, res) {
  try {
    if (req.payload.x) {
      const decryptedString = decrypt(CipherKey, req.payload.x);
      const json = JSON.parse(decryptedString);
      req.payload = json;
    }

    return true;
  } catch (e) {
    console.error(e);
    return Boom.unauthorized("Invalid Token");
  }
};

module.exports = verifyEncryptedPayload;
