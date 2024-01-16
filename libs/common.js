const bcrypt = require("bcrypt");
const config = require("config");
const dayjs = require("dayjs");
const utc = require("dayjs/plugin/utc");
dayjs.extend(utc);

const _this = {};

_this.hashPassword = (password) => {
  return new Promise((resolve, reject) => {
    bcrypt.hash(password, 10, (err, hash) => {
      if (err) return reject(err);
      return resolve(hash);
    });
  });
};

_this.generateCode = (length = 20) => {
  let text = "";
  const possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz01234567890";

  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

_this.genCardId = (name) => {
  return `${name?.replace(/\s/g, "-").replace(/\//g, "-")}-${_this.generateCode(
    4
  )}-${new Date().getTime()}`;
};

_this.getMongooseRegexSearch = (key) =>
  new RegExp(key.replace(/\W/g, "\\$&"), "i");

_this.getStartAndEndTimeOfADay = (date = new Date()) => {
  const startOfDate = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate()
  );
  const endOfDate = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
    23,
    59,
    59,
    999
  );
  return {
    startOfDate,
    endOfDate,
  };
};

_this.randomNumber = (min, max) => {
  return Math.floor(Math.random() * max) + min;
};

_this.useDeltaTimestamps = () => {
  const utcCurrentTime = dayjs();
  const t1 = utcCurrentTime.subtract(1, "day").startOf("minute").unix();
  const t2 = utcCurrentTime.subtract(2, "day").startOf("minute").unix();
  const tWeek = utcCurrentTime.subtract(1, "week").startOf("minute").unix();
  return [t1, t2, tWeek];
};

_this.getCurrentHourTimestamp = () => {
  return dayjs.utc().startOf("hour").unix();
};

_this.getStartDayUtcTimeStamp = () => {
  return dayjs.utc().startOf("day").unix();
};

_this.get2DayChange = (valueNow, value24HoursAgo, value48HoursAgo) => {
  const currentChange = parseFloat(valueNow) - parseFloat(value24HoursAgo);
  const previousChange =
    parseFloat(value24HoursAgo) - parseFloat(value48HoursAgo);
  const adjustedPercentChange =
    ((currentChange - previousChange) / previousChange) * 100;
  if (isNaN(adjustedPercentChange) || !isFinite(adjustedPercentChange)) {
    return [currentChange, 0];
  }
  return [currentChange, adjustedPercentChange];
};

_this.getTimestampUTC = (monthAgo) => {
  const date = new Date();
  date.setMonth(date.getMonth() - monthAgo);
  date.setHours(0, 0, 0, 0);
  return (date / 1000) | 0;
};

module.exports = _this;
