const _this = {};
const cardService = require("../services/card.service");

_this.getAllCard = async (req) => {
  const { conditions, pagination, projection } = req.query;
  const cards = await cardService.getAllCard(
    conditions,
    pagination,
    projection
  );
  return cards;
};

_this.createCard = async (req) => {
  const { payload } = req.body;
  const card = await cardService.createCard(payload);
  return card;
};

_this.updateCard = async (req) => {
  const { condition, payload } = req.body;
  const card = await cardService.updateCard(condition, payload);
  return card;
};

_this.deleteCard = async (req) => {
  const { condition } = req.body;
  const card = await cardService.deleteCard(condition);
  return card;
};

_this.findOne = async (req) => {
  const { condition, projection, populate } = req.query;
  const card = await cardService.findOne(condition, projection, populate);
  return card;
};
module.exports = _this;
