/**
 * Primary file for the API
 *
 */

// Dependencies
const http = require("http");
const https = require("https");
const url = require("url");
const fs = require("fs");
const StringDecoder = require("string_decoder").StringDecoder;
const config = require("./lib/config");
const handlers = require("./lib/handlers");
const helpers = require("./lib/helpers");

// Instantiate the HTTP server

const httpServer = http.createServer((req, res) => {
  unifiedServer(req, res);
});

// Start the HTTP server

httpServer.listen(config.httpPort, () => {
  console.log(`The server is listening on port ${config.httpPort}`);
});

// Instantiate the HTTPS server

const httpsServerOptions = {
  key: fs.readFileSync("./https/key.pem"),
  cert: fs.readFileSync("./https/cert.pem")
};
const httpsServer = https.createServer(httpsServerOptions, (req, res) => {
  unifiedServer(req, res);
});

// Start the HTTPS server

httpsServer.listen(config.httpsPort, () => {
  console.log(`The server is listening on port ${config.httpsPort}`);
});

// All the server logic for http and https server
const unifiedServer = (req, res) => {
  // Get the URL and parse it
  const parsedUrl = url.parse(req.url, true);

  // Get the path
  const path = parsedUrl.pathname;
  const trimmedPath = path.replace(/^\/+|\/+$/g, "");

  // Get the query string as an object
  const queryStringObject = parsedUrl.query;

  // Get the HTTP method
  const method = req.method.toLocaleLowerCase();

  // Get the headers as an object
  const headers = req.headers;

  // Get the payload, if any
  const decoder = new StringDecoder("utf-8");
  let buffer = "";

  req.on("data", data => {
    buffer += decoder.write(data);
  });
  req.on("end", () => {
    buffer += decoder.end();

    // Choose the handler this request should go to, if not fount user the notFound handler
    const chosenHandler =
      typeof router[trimmedPath] !== "undefined"
        ? router[trimmedPath]
        : handlers.notFound;

    // Construct the data object to send to the handler
    const data = {
      trimmedPath,
      queryStringObject,
      method,
      headers,
      payload: helpers.parseJsonToObject(buffer)
    };

    // Route the request to the handler specified in the router
    chosenHandler(data, (statusCode, payload) => {
      // Use the status code called back from the handler or default
      statusCode = typeof statusCode == "number" ? statusCode : 200;

      // User payload called back from the handler or default
      payload = typeof payload == "object" ? payload : {};

      // Convert the payload to string
      const payloadString = JSON.stringify(payload);

      // Return the response
      res.setHeader("Content-Type", "application/json");
      res.writeHead(statusCode);
      res.end(payloadString);

      // Log the response
      console.log(`Returning this response: ${statusCode} ${payloadString}`);
    });
  });
};



// Define a request router
const router = {
  ping: handlers.ping,
  users: handlers.users
};
