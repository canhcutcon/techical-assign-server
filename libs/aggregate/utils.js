/* eslint-disable max-len */
const Exception = require("../../helpers/exception");

const AggregateUtils = {};

/**
 *
 * @param {{ field: string, value: string }} query
 */
AggregateUtils.filterRegex = (query) => {
  return {
    $match: {
      [query.field]: { $regex: query.value, $options: "i" },
    },
  };
};

/**
 *
 * @param {{ field: string, value: string }} query
 */
AggregateUtils.filterExact = (query) => {
  if (Array.isArray(query.value)) {
    return {
      $match: {
        [query.field]: { $in: query.value },
      },
    };
  } else {
    return {
      $match: {
        [query.field]: query.value,
      },
    };
  }
};

/**
 *
 * @param {{field: string, value: any, exact: boolean }[]} queries
 * @param {('and'|'or')} type
 */
AggregateUtils.filter = (queries = [], type = "and") => {
  const filter = queries.map((query) => {
    if (query.exact === false) {
      if (Array.isArray(query.value)) {
        throw Exception.BadRequest("Invalid value filter");
      }
      return {
        [query.field]: { $regex: query.value, $options: "i" },
      };
    } else {
      if (Array.isArray(query.value)) {
        return {
          [query.field]: { $in: query.value },
        };
      }
      return {
        [query.field]: query.value,
      };
    }
  });

  if (type === "or") {
    return {
      $match: {
        $or: filter,
      },
    };
  }
  if (type === "and") {
    return {
      $match: {
        $and: filter,
      },
    };
  }
};

/**
 *
 * @param {string} searchValue
 * @param {string[]} fields
 */
AggregateUtils.searchKeyRegex = (searchValue = "", fields = []) => {
  const or = fields.map((field) => {
    return {
      [field]: {
        $regex: searchValue,
        $options: "i",
      },
    };
  });
  return {
    $match: {
      $or: or,
    },
  };
};

/**
 *
 * @param {{ externalCollection: string, fields: { external: string, internal: string }[], alias: string, pipelineLookup?: any[] }} query
 */

AggregateUtils.joinModel = (query) => {
  const { alias, externalCollection, fields, pipelineLookup = [] } = query;
  const letObj = {};
  const and = [];
  fields.forEach((field) => {
    const { external, internal } = field;
    letObj[external] = `$${external}`;
    and.push({
      $eq: [`$${internal}`, `$$${external}`],
    });
  });
  return {
    $lookup: {
      from: externalCollection,
      let: letObj,
      pipeline: [
        {
          $match: {
            $expr: {
              $and: and,
            },
          },
        },
        ...pipelineLookup,
      ],
      as: alias,
    },
  };
};

/**
 *
 * @param {strings} alias
 */
AggregateUtils.unwindLookup = (alias) => {
  return {
    $unwind: {
      path: `$${alias}`,
      preserveNullAndEmptyArrays: true,
    },
  };
};

/**
 *
 * @param {string | object} query
 */
AggregateUtils.select = (query) => {
  let project = {};
  if (typeof query === "string") {
    const queryArray = query.split(" ");
    queryArray.forEach((field) => {
      if (field.startsWith("-")) {
        project[field.substring(1, field.length)] = 0;
      } else {
        project[field] = 1;
      }
    });
  } else {
    project = query;
  }
  return {
    $project: project,
  };
};

/**
 *
 * @param {{ by: string, direction: ('asc'|'desc') | number }[]} sorts
 */
AggregateUtils.sort = (sorts) => {
  const sort = {};
  sorts.forEach((item) => {
    const direction =
      typeof item.direction === "number"
        ? item.direction
        : item.direction === "asc"
          ? 1
          : -1;
    sort[item.by] = direction;
  });
  return {
    $sort: sort,
  };
};

module.exports = AggregateUtils;
