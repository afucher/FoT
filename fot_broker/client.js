const io = require('socket.io-client');
var socket = io('http://localhost:3000');

socket.emit('register', "873612");

var counter = 12;

socket.on('interval', interval => {
    console.log("interval received", interval);
    setInterval(()=>{
        counter++;
        console.log("emit measure");
        socket.emit('measure', counter);
        if( counter >= 35 ) process.exit();
    }, interval*1000);
});

socket.on('disconnect', () => {
    process.exit();
});