var app = require('http').createServer();
var io = require('socket.io').listen(app);
var fluig = require('./fluigClient');
var referee = require('./referee');

app.listen(3000, function() {
 console.log("Up and running on 3000!");
});

fluig.getRules(2);

var visitas = 0;
io.on('connection', function(socket){
    var sensorId, rules;
    
    console.log("sensor connected");
    socket.emit('established', 1);
    console.log('send connected');
    
    socket.on('register', pSensorId => {
        console.log("register sensor " + pSensorId);
        sensorId = pSensorId;
        console.log('send interval');
        socket.emit('interval', 1);
        return;
        fluig.getRules(sensorId).then( rRules => {
            rules = rRules;

            socket.emit('interval', rules.interval);
        }).catch( error => {
            console.log("Error while getting rules for sensor " + sensorId);
            console.error(error);
        });
    })

    socket.on('measure', measure => {
        if( referree.judge(sensorId, measure, rules) ) {
            fluig.startWorkflow().then( result => {
                console.log("workflow started");
            }).catch( error => {
                console.log("Error while starting fluig workflow");
                console.error(error);
            });
        }
    });

    socket.on('disconnect', function() {
        console.log("sensor disconnected " + sensorId);
    });
});