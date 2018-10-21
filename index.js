/**
 * Primary file for the API
 *
 */

// Dependencies
const http = require("http");
const https = require("https");
const fs = require("fs");
const config = require("./config");

const server = require("./server");

// Instantiate the HTTP server

const httpServer = http.createServer((req, res) => {
  server.unifiedServer(req, res);
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
  server.unifiedServer(req, res);
});

// Start the HTTPS server

httpsServer.listen(config.httpsPort, () => {
  console.log(`The server is listening on port ${config.httpsPort}`);
});

