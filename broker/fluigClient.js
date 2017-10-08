module.exports = function() {
    var http = require('http');
    var soap = require('./soap');
    var envelopes = require('./fluigEnvelopes');
    
    function getRules(sensorId) {
        var data = envelopes.getDataset([
            {
                fieldName : 'SensorID',
                finalValue: sensorId,
                initialValue: sensorId
            }
        ]);

        soap.call("fluig05.hackathon2017.fluig.io", "/webdesk/ECMDatasetService?wsdl", data).then( result => {
            console.log(result);

            console.log(result.colunas);
            console.log(result.valores.length);
            console.log(result.valores[0].value[0]["_"]);
            console.log(result.valores[0].value[1]["_"]);
            console.log(result.valores[0].value[2]["_"]);

        });
    }

    function startWorkflow(sensorID, brokenRule, value) {
        var data = envelopes.startSimpleProcess([]);
        
        soap.call("fluig05.hackathon2017.fluig.io", "/webdesk/ECMWorkflowEngineService?wsdl", data).then( result => {
            console.log(result);
        });
    }

    return {
        startWorkflow: startWorkflow,
        getRules: getRules
    }
}();