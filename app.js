// var connect = require('connect');
// connect.createServer(connect.static(__dirname)).listen(3000);
var express = require('express');
// var app = express();

var app = require('http').createServer(handler),
  io = require('socket.io').listen(app),
  fs = require('fs')

  app.listen(3000);

function handler(req, res) {
  var filePath = req.url;
  console.log(req.url);
  fs.readFile(__dirname + filePath,
    function(err, data) {
      if (err) {
        res.writeHead(500);
        return res.end('Error loading ' + filePath);
      }

      res.writeHead(200);
      res.end(data);
    });
}

io.sockets.on('connection', function(socket) {
  // subscribe to "share_note:1234"
  socket.on('share_note:1234', function(data) {
  
    // publish message to "shared_note_changes:1234" event
    socket.broadcast.emit('shared_note_changes:1234', data);
  
  });

/*
io.sockets.on('connection', function(socket) {
  // subscribe to "share_note:change"
  socket.on('share_note:1234', function(data) {
    // publish message to "shared_note_changes:1234" data
    socket.broadcast.emit('shared_note_changes:1234', data);

  });
*/

});