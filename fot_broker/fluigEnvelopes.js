module.exports = function(){
    function getDataset(constraints) {
        var constStr = '';

        for( var i = 0; i < constraints.length; i++ ) {
            var constraint = "<item>";
            constraint += "<contraintType>MUST</contraintType>";
            constraint += "<fieldName>" + constraints[i].fieldName + "</fieldName>";
            constraint += "<finalValue>" + constraints[i].finalValue + "</finalValue>";
            constraint += "<initialValue>" + constraints[i].initialValue + "</initialValue>";
            constraint += "<likeSearch>false</likeSearch>";
            constraint += "</item>";

            constStr += constraint;
        }

        var str = '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ws="http://ws.dataservice.ecm.technology.totvs.com/">' +
        '<soapenv:Header/>' + 
        '<soapenv:Body>' + 
        '<ws:getDataset>' + 
            '<companyId>1</companyId>' + 
            '<username>fluig</username>' + 
            '<password>fluig</password>' + 
            '<name>dsGatilhos</name>' + 
            '<fields>' + 
                '<item>comportamento</item>' + 
                '<item>idGatilho</item>' + 
                '<item>documentid</item>' + 
                '<item>intervalo</item>' + 
                '<item>ocorrencia</item>' + 
                '<item>valor</item>' +  
                '<item>nome</item>' +  
                '<item>workflow</item>' + 
            '</fields>' + 
            '<constraints>' + 
                constStr + 
            '</constraints>' + 
            '<order>' + 
            '</order>' + 
        '</ws:getDataset>' + 
        '</soapenv:Body>' + 
        '</soapenv:Envelope>';

        return str;
    }

    
    function startSimpleProcess(cardData, workflow) {
        var cardDataStr = '';
        
        for( var i = 0; i < cardData.length; i++ ) {
            var item = "<item>";
            item += "<item>";
            item += cardData[i].field;
            item += "</item>";
            item += "<item>";
            item += cardData[i].value;
            item += "</item>";
            item += "</item>";

            cardDataStr += item;
        }

        var str = '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ws="http://ws.workflow.ecm.technology.totvs.com/">' +
                    '<soapenv:Header/>' + 
                    '<soapenv:Body>' + 
                    '<ws:simpleStartProcess>' + 
                        '<username>fluig</username>' + 
                        '<password>fluig</password>' + 
                        '<companyId>1</companyId>' + 
                        '<processId>' + workflow + '</processId>' + 
                        '<comments>Teste</comments>' + 
                        '<attachments>' + 
                        '</attachments>' + 
                        '<cardData>' + 
                            cardDataStr + 
                        '</cardData>' + 
                    '</ws:simpleStartProcess>' + 
                    '</soapenv:Body>' + 
                '</soapenv:Envelope>';
     
        return str;
    }
    
    return {
        getDataset: getDataset,
        startSimpleProcess: startSimpleProcess
    }
    
}();