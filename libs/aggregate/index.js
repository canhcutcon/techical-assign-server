/* eslint-disable max-len */
const AggregateUtils = require("./utils");

class AggregateFind {
  model = [];
  pipelineStages = [];

  constructor (_model) {
    this.model = _model;
    this.pipelineStages = [];
  }

  /**
   * Custom pipeline
   * @param pipelineStages
   */
  addPipelineState (pipelineStages) {
    this.pipelineStages.push(pipelineStages);
  }

  /**
   *
   * @param {{ field: string, value: string }} query
   */
  filterRegex = (query) => {
    this.pipelineStages.push(AggregateUtils.filterRegex(query));
  };

  /**
   *
   * @param {{ field: string, value: string }} query
   */
  filterExact (query) {
    this.addPipelineState(AggregateUtils.filterExact(query));
  }

  /**
   *
   * @param {{field: string, value: any, exact: boolean }[]} queries
   * @param {('and'|'or')} type
   */
  filter (queries = [], type = "and") {
    this.addPipelineState(AggregateUtils.filter(queries, type));
  }

  /**
   *
   * @param {string} searchValue
   * @param {string[]} fields
   */
  searchKeyRegex = (searchValue = "", fields = []) => {
    if (fields?.length > 0) {
      this.addPipelineState(AggregateUtils.searchKeyRegex(searchValue, fields));
    }
  };

  /**
   *
   * @param {{ externalCollection: string, fields: { external: string, internal: string }[], alias: string, justOne: boolean, pipelineLookup?: any[] }} query
   */
  joinModel = (query) => {
    const { alias, justOne } = query;
    this.addPipelineState(AggregateUtils.joinModel(query));
    if (justOne) {
      this.addPipelineState(AggregateUtils.unwindLookup(alias));
    }
  };

  /**
   *
   * @param {string | object} query
   */
  select = (query) => {
    this.addPipelineState(AggregateUtils.select(query));
  };

  /**
   *
   * @param {{ by: string, direction: ('asc'|'desc') | number }[]} sorts
   */
  sort = (sorts) => {
    this.addPipelineState(AggregateUtils.sort(sorts));
  };

  /**
   *
   * @param {string | number} skip
   * @param {string | number} limit
   * @returns
   */
  async exec (skip = 0, limit = 50) {
    const data = await this.model.aggregate([
      ...this.pipelineStages,
      {
        $skip: Number(skip),
      },
      {
        $limit: Number(limit),
      },
    ]);
    const total =
      this.pipelineStages.length > 0
        ? (
          await this.model.aggregate([
            ...this.pipelineStages,
            {
              $count: "total",
            },
          ])
        )?.[0]?.total || 0
        : 0;
    return { data, total };
  }

  /**
   *
   * @param {string | number} skip
   * @param {string | number} limit
   * @returns
   */
  async execWithoutCount (skip = 0, limit = 50) {
    const data = await this.model.aggregate([
      ...this.pipelineStages,
      {
        $skip: Number(skip),
      },
      {
        $limit: Number(limit),
      },
    ]);
    return { data };
  }
}

module.exports = AggregateFind;
