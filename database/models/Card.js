"use strict";

const { ref } = require("joi");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const schema = new Schema(
  {
    cardId: { type: String, required: true, index: true },
    name: { type: String, required: true },
    image: { type: String, required: true },
    description: { type: String },
    isActive: { type: Boolean, default: true },
    quantity: { type: Date, default: new Date() },
    price: { type: Number, default: 0 },
    attributes: {
      type: [
        {
          _id: false,
          trait_type: { type: String, required: true },
          value: {
            type: Schema.Types.Mixed,
            required: true,
          },
          display_type: {
            type: String,
          },
        },
      ],
      default: [],
    },
    rarity: { type: String, default: null },
    category: { type: String, default: null, ref: "category" },
    type: { type: String, default: null, required: false },
    status: { type: String, default: "show" },
  },
  { timestamps: true }
);

schema.index({ cardId: 1, name: 1 }, { unique: true });

module.exports = mongoose.model("card", schema);
