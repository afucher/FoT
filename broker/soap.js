module.exports = function() {
    var http = require('http');
    var Promise = require('bluebird');
    var parseString = require('xml2js').parseString;

    function call(host, path, data) {
        var options = {
            protocol: 'http:',
            host: host,
            port: 8080,
            method: 'POST',
            path: path,
            headers: { 'Content-type': 'text/xml' }
        }

        return new Promise(function(resolve, reject) {
            var result;
            var retorno;
            var req = http.request(options, (response) => {
                var str = '';

                response.on('error', function(error) {
                    reject(error);
                });

                response.on('data', function (chunk) {
                  str += chunk;
                });
              
                response.on('end', function () {
                  parseString(str, function (err, result) {
                      retorno = {
                        colunas: result['soap:Envelope']['soap:Body'][0]['ns1:getDatasetResponse'][0].dataset[0].columns,
                        valores: result['soap:Envelope']['soap:Body'][0]['ns1:getDatasetResponse'][0].dataset[0].values
                      }

                      resolve(retorno);
                  });
    
                });
            });
    
            req.write(data);
            req.end();
        });
    }
    return {
        call : call
    };
}();