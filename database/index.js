const mongoose = require("mongoose");
const config = require("config");
const DbConnectString = config.get("database").uri;

mongoose.set("strictQuery", false);

const MONGO_EVENTS = {
  TIMEOUT: "timeout",
  ERROR: "error",
  RECONNECTED: "reconnected",
};

const DB_LOG_MESSAGES = {
  reconnectSuccess: "Reconnect MongoDB success !!!",
  reconnectFailed: "Reconnect MongoDB success !!!",
  connectFailed: "Could not connect to MongoDB !!!",
  connectSuccess: "Connect MongoDB success !!!",
  timeout: "db: mongodb timeout",
};

const connectMongo = (cb) => {
  mongoose
    .connect(DbConnectString)
    .then(async () => {
      console.info(DB_LOG_MESSAGES.connectSuccess);
      require("./models");
      if (cb) {
        cb();
      }
    })
    .catch((err) => {
      console.error(DB_LOG_MESSAGES.connectFailed);
      console.error(err);
    });
};

const reconnectMongo = () => {
  mongoose
    .connect(DbConnectString)
    .then(() => {
      console.info(DB_LOG_MESSAGES.reconnectSuccess);
    })
    .catch((err) => {
      console.error(DB_LOG_MESSAGES.reconnectFailed);
      console.error(err);
    });
};

const listenTimeoutEvent = () => {
  mongoose.connection.on(MONGO_EVENTS.TIMEOUT, function (e) {
    console.error(DB_LOG_MESSAGES.timeout + e);
    mongoose.disconnect();
    reconnectMongo();
  });
};

const listenErrorEvent = () => {
  mongoose.connection.on(MONGO_EVENTS.ERROR, function (e) {
    console.error(DB_LOG_MESSAGES.connectFailed + e);
    mongoose.disconnect();
    reconnectMongo();
  });
};

const listenReconnectedEvent = () => {
  mongoose.connection.on(MONGO_EVENTS.RECONNECTED, function () {
    console.info("MongoDB reconnected!");
  });
};

const listenMongoEvents = () => {
  listenTimeoutEvent();
  listenErrorEvent();
  listenReconnectedEvent();
};

module.exports = {
  listenMongoEvents,
  connectMongo,
};
