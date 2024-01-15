/* eslint-disable no-process-exit */
const mongoose = require("mongoose");
const os = require("os");

const processEvents = {
  SIGINT: "SIGINT",
  UNHANDLED_REJECTION: "unhandledRejection",
  EXIT: "exit",
  UNCAUGHT_EXCEPTION: "uncaughtException",
  MULTIPLE_RESOLVES: "multipleResolves",
};

const processEventListener = () => {
  process.exitCode = 1;
  process.on(processEvents.EXIT, (code) => {
    console.info(`About to exit with code: ${code}`);
  });
  process.on(processEvents.UNCAUGHT_EXCEPTION, function (err) {
    console.info("Node NOT Exiting...", err);
  });
  process.on(processEvents.UNHANDLED_REJECTION, (reason, p) => {
    console.info("Unhandled Rejection at: Promise", p, "reason:", reason);
  });
  process.on(processEvents.MULTIPLE_RESOLVES, (type, promise, reason) => {
    console.error("multipleResolves", type, promise, reason);
  });

  process.on(processEvents.SIGINT, function () {
    mongoose.connection.close(function () {
      console.warn(
        "Mongoose connection is disconnected due to application termination"
      );
      process.exit(1);
    });
  });
};

module.exports = processEventListener;
