// var connect = require('connect');
// connect.createServer(connect.static(__dirname)).listen(3000);
var express = require('express');
// var app = express();

var app = require('http').createServer(handler),
  io = require('socket.io').listen(app),
  fs = require('fs')
  url = require('url')
  app.listen(3000);


function handler(req, res) {
  var roomId="";
  var filePath = req.url;
  var parsedURL = url.parse(req.url);
  var hash = parsedURL.hash;
  var queryString = roomId = parsedURL.query;
  console.log("roomId = " + roomId);
  if (roomId) createSocketForRoom(roomId);
  fs.readFile(__dirname + parsedURL.pathname,
    function(err, data) {
      if (err) {
        res.writeHead(500);
        return res.end('Error loading ' + parsedURL.pathname);
      }
      res.writeHead(200);
      res.end(data);
  });
}

function createSocketForRoom(roomId) {
  io.sockets.on('connection', function(socket) {
      // subscribe to "share_note:1234"
      console.log("> roomId = " + roomId);
      socket.on('share_note:'+roomId, function(data) {
        console.log("data = " + data);
        console.log(">> roomId = " + roomId);
        // publish message to "shared_note_changes:1234" event
        socket.broadcast.emit('shared_note_changes:'+roomId, data);

      });
  });
}
