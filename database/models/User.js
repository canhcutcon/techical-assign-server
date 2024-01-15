"use strict";

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const schema = new Schema(
  {
    name: { type: String, required: false, index: true },
    username: { type: String, required: true, index: true, unique: true },
    password: { type: String, required: true },
    email: {
      type: String,
      unique: true,
      sparse: true,
      lowercase: true,
    },
    image: { type: String, required: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("user", schema);
