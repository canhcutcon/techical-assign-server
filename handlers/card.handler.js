const _this = {};
const cardService = require("../services/card.service");
const { ApiResponse } = require("../helpers/index");
const { genCardId } = require("../libs/common");
const { getPagination } = require("../helpers/api-request");

_this.getAllCard = async (req) => {
  const { name, category, rarity, status, sort, order } = req.query;
  const conditions = {
    ...(name && { name: { $regex: name, $options: "i" } }),
    ...(category && { category }),
    ...(rarity && { rarity }),
    ...(status && { status }),
  };

  const data = await cardService.getAllCard(
    conditions,
    getPagination(req.query),
    {},
    { [sort]: order }
  );

  return ApiResponse.success(data);
};

_this.createCard = async (req) => {
  const { payload } = req.body;
  const cardId = genCardId(payload.name);
  const card = await cardService.createCard({ cardId, ...payload });
  return ApiResponse.success(card);
};

_this.updateCard = async (req) => {
  const { condition, payload } = req.body;
  const card = await cardService.updateCard(condition, payload);
  return ApiResponse.success(card);
};

_this.deleteCard = async (req) => {
  const { condition } = req.body;
  const card = await cardService.deleteCard(condition);
  return ApiResponse.success(card);
};

_this.findOne = async (req) => {
  const { cardId } = req.params;
  const card = await cardService.findOne({ cardId }, {}, []);
  return ApiResponse.success(card);
};

module.exports = _this;
