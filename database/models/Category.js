"use strict";

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Model = new Schema(
  {
    slug: { type: String, required: true, unique: true },
    name: { type: Object, _id: false },
    description: String,
    icon: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("category", Model);
