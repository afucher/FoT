const io = require('socket.io-client');
var socket = io('http://localhost:3000');
socket.on('visits', function(visitas){
    console.log(visitas);
});