const http = require("http");

const _this = {};

_this.isBoolean = function (value) {
  return typeof value === "boolean";
};

_this.isMongoObjectId = function (value) {
  if (!value) return false;
  return /^[0-9a-fA-F]{24}$/.test(value);
};

_this.removeLeadingZeros = function (value, times = 1) {
  if (times <= 0) {
    return value;
  }
  if (value.startsWith("0")) {
    return _this.removeLeadingZeros(value.substring(1), times - 1);
  }
  return value;
};

_this.httpRequest = (method, url, body = null) => {
  method = method.toLowerCase();
  if (!["get", "post"].includes(method)) {
    throw new Error(`Invalid method: ${method}`);
  }

  let urlObject;

  try {
    urlObject = new URL(url);
  } catch (error) {
    throw new Error(`Invalid url ${url}`);
  }

  if (body && method !== "post") {
    throw new Error(`Invalid use of the body parameter with ${method.toUpperCase()} method.`);
  }

  const options = {
    method: method.toUpperCase(),
    hostname: urlObject.hostname,
    port: urlObject.port,
    path: urlObject.pathname,
  };

  if (body) {
    options.headers = {
      "Content-Length": Buffer.byteLength(JSON.stringify(body)),
      "Content-Type": "application/json",
      "Accept-Encoding": "gzip, compress, deflate, br",
      Accept: "application/json, text/plain, */*",
    };
  }

  return new Promise((resolve, reject) => {
    const clientRequest = http.request(options, incomingMessage => {
      // Response object.
      const response = {
        statusCode: incomingMessage.statusCode,
        headers: incomingMessage.headers,
        body: [],
      };

      // Collect response body data.
      incomingMessage.on("data", chunk => {
        response.body.push(chunk);
      });

      // Resolve on end.
      incomingMessage.on("end", () => {
        if (response.body.length) {
          response.body = response.body.join();

          try {
            response.body = JSON.parse(response.body);
          } catch (error) {
            // Silently fail if response is not JSON.
            console.log("httpRequest error: ", error);
          }
        }

        resolve(response);
      });
    });

    // Reject on request error.
    clientRequest.on("error", error => {
      reject(error);
    });

    // Write request body if present.
    if (body) {
      clientRequest.write(JSON.stringify(body));
    }

    // Close HTTP connection.
    clientRequest.end();
  });
};

module.exports = _this;
