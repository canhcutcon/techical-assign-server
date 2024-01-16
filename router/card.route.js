const Handler = require("../handlers/card.handler");
const Joi = require("../libs/joi");
const { AdminAuthRequest } = require("../helpers/api-handler");
const { RATE_CARD, CARD_CATEGORY } = require("../config/const");

const CardRouter = {};

CardRouter.createCard = AdminAuthRequest({
  tags: ["Cards"],
  description: "Create new card for sell",
  validate: {
    payload: Joi.object({
      name: Joi.string().required().description("Card name"),
      image: Joi.string().required().description("Card image"),
      price: Joi.number().required().description("Card price"),
      description: Joi.string().required().description("Card description"),
      quantity: Joi.number().required().description("Card quantity"),
      attributes: Joi.array()
        .items(
          Joi.object({
            trait_type: Joi.string().required(),
            value: Joi.string().required(),
            display_type: Joi.string().required(),
          })
        )
        .required()
        .description("Card attributes"),
      rarity: Joi.string().required().description("Card rarity"),
      category: Joi.string().required().description("Card category"),
    }),
  },
  handler: Handler.createCard,
});

CardRouter.updateCard = AdminAuthRequest({
  tags: ["Cards"],
  description: "Update card",
  validate: {
    params: Joi.object({
      cardId: Joi.string().required().description("Card id"),
    }),
    payload: Joi.object({
      name: Joi.string().description("Card name").optional(),
      image: Joi.string().description("Card image").optional(),
      price: Joi.number().description("Card price").optional(),
      description: Joi.string().description("Card description").optional(),
      quantity: Joi.number().description("Card quantity").optional(),
      attributes: Joi.array()
        .items(
          Joi.object({
            trait_type: Joi.string().required(),
            value: Joi.string().required(),
            display_type: Joi.string().required(),
          })
        )
        .description("Card attributes")
        .optional(),
      rarity: Joi.string().description("Card rarity"),
      category: Joi.string().description("Card category"),
    }),
  },
  handler: Handler.updateCard,
});

CardRouter.deleteCard = AdminAuthRequest({
  tags: ["Cards"],
  description: "Delete card",
  validate: {
    params: Joi.object({
      cardId: Joi.string().required().description("Card id"),
    }),
  },
  handler: Handler.deleteCard,
});

CardRouter.getCard = AdminAuthRequest({
  tags: ["Cards"],
  description: "Get card",
  validate: {
    params: Joi.object({
      cardId: Joi.string().required().description("Card id"),
    }),
  },
  handler: Handler.findOne,
});

CardRouter.getCards = AdminAuthRequest({
  tags: ["Cards"],
  description: "Get cards",
  validate: {
    query: Joi.object({
      limit: Joi.number().default(10).description("Limit"),
      page: Joi.number().default(1).description("Page"),
      name: Joi.string().description("Card name"),
      category: Joi.string().description("Card category"),
      rarity: Joi.string().description("Card rarity"),
      status: Joi.string().description("Card status").default("show"),
      sort: Joi.string().default("createdAt").description("Sort"),
      order: Joi.string().default("desc").description("Order"),
      key: Joi.string().description("Key search").optional().allow(""),
    }),
  },
  handler: Handler.getAllCard,
});

module.exports = CardRouter;
