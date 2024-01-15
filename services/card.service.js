const { Card } = require("../database/models/index");
const _this = {};

_this.findOne = async (condition = {}, projection = {}, populate = []) => {
  return Card.findOne(condition, projection).populate(populate).lean();
};

_this.getAllCard = async (conditions, pagination, projection = {}) => {
  const { limit, page, skip } = pagination;
  projection = {
    ...projection,
    ...{ _id: 0, createdAt: 0, updatedAt: 0, __v: 0 },
  };

  const [items, total] = await Promise.all([
    Card.find(conditions, projection).skip(skip).limit(limit).lean(),
    Card.countDocuments(conditions),
  ]);

  return {
    items,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
};

_this.createCard = async (payload) => {
  return Card.create({
    ...payload,
  });
};

_this.updateCard = async (condition, payload) => {
  return Card.updateOne(condition, payload);
};

_this.deleteCard = async (condition) => {
  return Card.deleteOne(condition);
};

module.exports = _this;
