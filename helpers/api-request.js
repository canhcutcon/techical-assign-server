const _this = {};

/**
 * @param {Object} query
 * @param {Number} defaultLimit
 * @returns {Object} paginationInfo
 * @returns {Number} paginationInfo.limit
 * @returns {Number} paginationInfo.page
 * @returns {Number} paginationInfo.skip
 * @description
 * This function is used to get pagination info from query params
 * @example
 * const paginationInfo = getPagination(req.query);
 * const { limit, page, skip } = paginationInfo;
 **/
_this.getPagination = (query, defaultLimit = 50) => {
  if (!query) {
    return {
      limit: defaultLimit,
      page: 1,
      skip: 0,
    };
  }
  const { page } = query;
  const limit = parseInt(query.limit);
  const paginationInfo = {
    limit: Number.isInteger(limit) ? limit : defaultLimit,
    page: page ? parseInt(page) : 1,
  };

  paginationInfo.skip = paginationInfo.limit * (paginationInfo.page - 1);
  return paginationInfo;
};

_this.getSort = (query, defaultSort = { sortBy: "createdAt", sortDirection: "desc" }) => {
  if (!query) {
    return defaultSort;
  }
  const { sortDirection, sortBy } = query;
  return {
    sortBy: sortBy || "createdAt",
    sortDirection: sortDirection || "desc",
  };
};

module.exports = _this;
