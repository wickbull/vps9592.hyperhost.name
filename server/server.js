process.on('uncaughtException', function(err){
	console.log('Caught exception: ' + err );
});


var express = require('express');
var app = express();
app.use(express.static('../client'));
app.listen(80);

var map = {};
map.l = 0;
map.r = 400;
map.t = 0;
map.b = 400;
var startMass = 30;

var WebSocketServer = new require('ws');

// connect
var clients = {};
var players = {};

function rand(min, max)
{
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

// WebSocket 443
var webSocketServer = new WebSocketServer.Server({
  port: 443
});
webSocketServer.on('connection', function(ws) {

  var id = Math.random();
  clients[id] = ws;
  players[id] = {};
  players[id].x = rand(map.l,map.r);
  players[id].y = rand(map.t,map.b);
  players[id].s = startMass;

  ws.send(JSON.stringify({'type':'map','data':map}));
  var inter = setInterval(function(){
  	if(ws&&ws.readyState==1){
  		ws.send(JSON.stringify({'type':'players','data':players,'myid':id}));
  	}
  },10)

  ws.on('message', function(message) {

    for (var key in clients) {
      clients[key].send(message);
    }
  });

  ws.on('close', function() {
    delete clients[id];
    delete players[id];
    clearInterval(inter);
  });

});