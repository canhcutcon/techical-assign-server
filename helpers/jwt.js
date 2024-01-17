"use strict";

const jwt = require("jsonwebtoken");
const config = require("config");
const JwtConfig = config.get("jwt");

const createToken = (user) => {
  try {
    return jwt.sign(user, JwtConfig.secret, {
      algorithm: "HS256",
      expiresIn: "10y",
    });
  } catch (error) {
    console.error("Error creating token:", error);
    throw new Error("Error creating token");
  }
};

const decodeToken = (token) => {
  try {
    return jwt.verify(token, JwtConfig.secret, { algorithms: ["HS256"] });
  } catch (error) {
    console.error("Error decoding token:", error);
    return null;
  }
};

const decodeTokenFromAuth = (auth) => {
  const tokens = auth.split(" ");
  return decodeToken(tokens[1]);
};

module.exports = { createToken, decodeToken, decodeTokenFromAuth };
