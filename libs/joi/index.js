const assert = require("assert");
const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);
Joi.doesNotContainUrlsString = require("joi-does-not-contain-url-string")(Joi);

Joi.pagination = (schema = {}) => {
  schema.limit = Joi.number().integer().min(1);
  schema.page = Joi.number().integer().min(1);

  return schema;
};

Joi.unsafePagination = (schema = {}) => {
  schema.limit = Joi.number().integer().min(0);
  schema.page = Joi.number().integer().min(1);

  return schema;
};

Joi.paginationWithSort = (schema = {}, sortBy = []) => {
  schema.limit = Joi.number().integer().min(1);
  schema.page = Joi.number().integer().min(1);
  if (sortBy?.length > 0) {
    schema.sortBy = Joi.string()
      .valid(...sortBy)
      .optional();
  } else {
    schema.sortBy = Joi.string().optional();
  }
  schema.sortDirection = Joi.string()
    .valid("desc", "asc")
    .default("desc")
    .optional();
  return schema;
};

Joi.unsafePaginationWithSort = (schema = {}, sortBy = []) => {
  schema.limit = Joi.number().integer().min(0);
  schema.page = Joi.number().integer().min(1);
  if (sortBy?.length > 0) {
    schema.sortBy = Joi.string()
      .valid(...sortBy)
      .optional();
  } else {
    schema.sortBy = Joi.string().optional();
  }
  schema.sortDirection = Joi.string()
    .valid("desc", "asc")
    .default("desc")
    .optional();
  return schema;
};

module.exports = Joi;
