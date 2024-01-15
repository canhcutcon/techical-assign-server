const fs = require("fs");

const syncIndexes = async () => {
  const files = fs.readdirSync("./database/models");
  await Promise.all(
    files.map(async (file) => {
      try {
        if (file !== "index.js") {
          const model = require(`./models/${file}`);
          await model.syncIndexes();
        }
      } catch (error) {
        console.error("SyncIndexes error at model: ", file);
        console.error(error);
      }
    })
  );
};

module.exports = syncIndexes;
