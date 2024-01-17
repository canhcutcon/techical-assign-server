const _this = {};
const cardService = require("../services/card.service");
const { ApiResponse } = require("../helpers/index");
const { genCardId } = require("../libs/common");
const { getPagination } = require("../helpers/api-request");

_this.getAllCard = async (req) => {
  const { name, category, rarity, status, sort, order, key } = req.query;
  const conditions = {
    ...(name && { name: { $regex: name, $options: "i" } }),
    ...(category && { category }),
    ...(rarity && { rarity }),
    ...(status && { status }),
  };

  if (key) {
    conditions.$or = [
      { name: { $regex: key, $options: "i" } },
      { cardId: { $regex: key, $options: "i" } },
      { description: { $regex: key, $options: "i" } },
    ];
  }

  const data = await cardService.getAllCard(
    conditions,
    getPagination(req.query),
    {},
    { [sort]: order }
  );

  return ApiResponse.success(data);
};

_this.createCard = async (req) => {
  const cardId = genCardId(req.payload?.name);
  const card = await cardService.createCard({
    cardId,
    ...req.payload,
  });
  return ApiResponse.success(card);
};

_this.updateCard = async (req) => {
  const card = await cardService.updateCard(
    { cardId: req?.params?.cardId },
    req.payload
  );
  return ApiResponse.success(card);
};

_this.deleteCard = async (req) => {
  const { cardId } = req.params;
  const card = await cardService.deleteCard({ cardId });
  return ApiResponse.success(card);
};

_this.findOne = async (req) => {
  const { cardId } = req.params;
  const card = await cardService.findOne({ cardId }, {}, []);
  return ApiResponse.success(card);
};

module.exports = _this;
