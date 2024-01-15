"use strict";

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const schema = new Schema(
  {
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true, unique: true },
    accessToken: String,
  },
  { timestamps: true }
);
module.exports = mongoose.model("admin", schema);
