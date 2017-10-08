module.exports = function() {
    var http = require('http');
    var moment = require('moment');
    var soap = require('./soap');
    var envelopes = require('./fluigEnvelopes');
    
    function getRules(sensorId) {
        var data = envelopes.getDataset([
            {
                fieldName : 'idGatilho',
                finalValue: sensorId,
                initialValue: sensorId
            }
        ]);

        return soap.call("/webdesk/ECMDatasetService?wsdl", data).then( soapBody => {
            return parseRules(soapBody[0]['ns1:getDatasetResponse']);
        });
    }

    function startWorkflow(rule, measure) {
        var dataStr = moment().format("YYYY-MM-DD HH:mm:ss");
        var data = envelopes.startSimpleProcess([
            { field: 'idGatilho', value: rule.idGatilho},
            { field: 'nome', value: rule.nome},
            { field: 'comportamento', value: rule.comportamento},
            { field: 'valorRegra', value: rule.valor},
            { field: 'intervalo', value: rule.intervalo},
            { field: 'ocorrencia', value: rule.ocorrencia},
            { field: 'dataLeitura', value: dataStr},
            { field: 'valor', value: measure},
            { field: 'media', value: 'provisorio media'},
        ], rule.workflow);
        
        return soap.call("/webdesk/ECMWorkflowEngineService?wsdl", data).then( result => {
            console.log(result);
            return false;
        });
    }

    function parseRules(getDatasetResponse) {
        var dataset = getDatasetResponse[0].dataset[0];
        var colunas = dataset.columns;
        var valores = dataset.values;
        var rules = [];

        for( var i = 0; i < valores.length; i++ ) {
            var newRule = {};
            var valor = valores[i].value;
            for( var j = 0; j < valor.length; j++ ) {
                newRule[colunas[j]] = valor[j]['_'];
            }

            rules.push(newRule);
        }
        return rules;
    }

    return {
        startWorkflow: startWorkflow,
        getRules: getRules
    }
}();