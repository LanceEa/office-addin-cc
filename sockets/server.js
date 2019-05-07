#!/usr/bin/env node

var fs = require('fs');
var WebSocketServer = require('websocket').server;
var https = require('https');

var key = fs.readFileSync('ssl/server.key');
var cert = fs.readFileSync('ssl/server.crt');

var server = https.createServer(
  {
    cert,
    key
  },
  function(request, response) {
    console.log(new Date() + ' Received request for ' + request.url);
    response.writeHead(404);
    response.end();
  }
);

server.listen(8100, function() {
  console.log(new Date() + ' Server is listening on port 8100');
});

wsServer = new WebSocketServer({
  httpServer: server,
  // You should not use autoAcceptConnections for production
  // applications, as it defeats all standard cross-origin protection
  // facilities built into the protocol and the browser.  You should
  // *always* verify the connection's origin and decide whether or not
  // to accept it.
  autoAcceptConnections: false
});

function originIsAllowed(origin) {
  // put logic here to detect whether the specified origin is allowed.
  return true;
}

wsServer.on('request', function(request) {
  if (!originIsAllowed(request.origin)) {
    // Make sure we only accept requests from an allowed origin
    request.reject();
    console.log(new Date() + ' Connection from origin ' + request.origin + ' rejected.');
    return;
  }

  var connection = request.accept('cc-protocol', request.origin);
  console.log(new Date() + ' Connection accepted.');
  connection.on('message', function(message) {
    if (message.type === 'utf8') {
      console.log('Received Message: ' + message.utf8Data);
      const result = fib(+message.utf8Data);
      console.log(result);
      connection.sendUTF(result.toString());
    } else if (message.type === 'binary') {
      console.log('Received Binary Message of ' + message.binaryData.length + ' bytes');
      connection.sendBytes(message.binaryData);
    }
  });
  connection.on('close', function(reasonCode, description) {
    console.log(new Date() + ' Peer ' + request.remoteAddress + ' disconnected.');
  });
});

function fib(n) {
  if (n <= 1) {
    return 1;
  }

  return fib(n - 1) + fib(n - 2);
}
