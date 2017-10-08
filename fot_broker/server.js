var app = require('http').createServer();
var io = require('socket.io').listen(app);
var fluig = require('./fluigClient');
var referee = require('./referee');

app.listen(3000, function() {
 console.log("Up and running on 3000!");
});

var visitas = 0;
io.on('connection', function(socket){
    socket.sensor = {};
    
    console.log("sensor connected");
    socket.emit('established', 1);
    
    socket.on('register', pSensorId => {
        console.log("register sensor " + pSensorId);
        socket.sensor.id = pSensorId;
        fluig.getRules(socket.sensor.id).then( rRules => {
            socket.sensor.rules = rRules;
            console.log("got rules, emit interval");
            socket.emit('interval', 2);
        }).catch( error => {
            console.log("Error while getting rules for sensor " + socket.sensor.id);
            console.error(error);
        });
    })

    socket.on('measure', measure => {
        if( !socket.sensor.rules ) return;

        for( var i = 0; i < socket.sensor.rules.length; i++ ) {
            socket.sensor.rules[i] = referee.judge(socket.sensor.rules[i], measure);
            
            if( socket.sensor.rules[i].status.flag ) {
                console.log(socket.sensor.rules[i]);
                fluig.startWorkflow(socket.sensor.rules[i], measure).then( result => {
                    console.log("workflow started");
                }).catch( error => {
                    console.log("Error while starting fluig workflow");
                    //console.error(error);
                });
            } else {
                //console.log("Rule not triggered. Measure: " + measure);
            }
        }
    });

    socket.on('disconnect', function() {
        console.log("sensor disconnected " + socket.sensor.id);

    });
});