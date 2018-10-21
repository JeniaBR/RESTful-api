const handlers = require("./handlers");

const router = {
  ping: handlers.ping,
  hello: handlers.hello
};

exports.getHandler = path => {
  return typeof router[path] !== "undefined"
    ? router[path]
    : handlers.notFound;
};
