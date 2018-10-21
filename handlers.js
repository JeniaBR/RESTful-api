// Define the handlers
const handlers = {};

// Ping handler
handlers.ping = (data, callback) => {
  callback(null, { message: "All good here! :)" });
};

// Not found handler
handlers.notFound = (data, callback) => {
  callback(404);
};

// Hello handler
handlers.hello = (data, callback) => {
  const { userName } = data.queryStringObject;
  callback(null, {
    message: userName
      ? `Hello, ${userName} welcome to our Node.js API!`
      : "Hello welcome to our Node.js API"
  });
};

module.exports = handlers;