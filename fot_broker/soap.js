module.exports = function() {
    var http = require('http');
    var Promise = require('bluebird');
    var parseString = require('xml2js').parseString;
    var conf = require('./config.json');

    function call(path, data) {
        var options = {
            protocol: conf.fluig.protocol + ':',
            host: conf.fluig.host,
            port: conf.fluig.port,
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
                        resolve(result['soap:Envelope']['soap:Body']);
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