var app = require('http').createServer();
var io = require('socket.io').listen(app);
var fluig = require('./fluigClient');
var referee = require('./referee');

app.listen(3000, function() {
 console.log("Up and running on 3000!");
});

var visitas = 0;
io.on('connection', function(socket){
    var sensor = {};
    
    console.log("sensor connected");
    socket.emit('established', 1);
    
    socket.on('register', pSensorId => {
        console.log("register sensor " + pSensorId);
        sensor.id = pSensorId;
        fluig.getRules(sensor.id).then( rRules => {
            sensor.rules = rRules;
            console.log("got rules, emit interval");
            socket.emit('interval', 1);
        }).catch( error => {
            console.log("Error while getting rules for sensor " + sensor.id);
            console.error(error);
        });
    })

    socket.on('measure', measure => {
        for( var i = 0; i < sensor.rules.length; i++ ) {
            sensor.rules[i] = referee.judge(sensor.rules[i], measure);
            
            if( sensor.rules[i].status.flag ) {
                fluig.startWorkflow(sensor.rules[i], measure).then( result => {
                    console.log("workflow started");
                    if( sensor ) {
                        sensor.rules[i].status.flag = false;
                    }
                }).catch( error => {
                    console.log("Error while starting fluig workflow");
                    console.error(error);
                });
            } else {
                console.log("No rules broken");
            }
        }
    });

    socket.on('disconnect', function() {
        console.log("sensor disconnected " + sensor.id);

        sensor = null;
    });
});