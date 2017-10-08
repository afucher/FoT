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
            '<name>dsFoT</name>' + 
            '<fields>' + 
            '</fields>' + 
            '<constraints>' + 
                constStr + 
            '</constraints>' + 
            '<order>' + 
            '</order>' + 
        '</ws:getDataset>' + 
        '</soapenv:Body>' + 
        '</soapenv:Envelope>';

        console.log(str);
        return str;
    }

    /*
    function startSimpleProcess(constraints) {
        var constStr = '';
        var str = '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ws="http://ws.workflow.ecm.technology.totvs.com/">' +
        '<soapenv:Header/>' + 
        '<soapenv:Body>' + 
           '<ws:simpleStartProcess>' + 
              '<username>fluig</username>' + 
              '<password>fluig</password>' + 
              '<companyId>1</companyId>' + 
              '<processId>hackathonFluig</processId>' + 
              '<comments>Teste</comments>
              '<attachments>
              '</attachments>
              <cardData>
                 <item>
                    <item>idSensor</item>
                    <item>12345</item>
                 </item>
                 <item>
                    <item>regra</item>
                    <item>2222</item>
                 </item>
                 <item>
                    <item>dataLeitura</item>
                    <item>07/10/2017 19:00:08</item>
                 </item>
                 <item>
                    <item>valor</item>
                    <item>20</item>
                 </item>  
                 <item>
                    <item>mediar</item>
                    <item>10</item>
                 </item>            
              </cardData>
           </ws:simpleStartProcess>
        </soapenv:Body>
     </soapenv:Envelope>
     
     
     <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ws="http://ws.dataservice.ecm.technology.totvs.com/">' +
        '<soapenv:Header/>' + 
        '<soapenv:Body>' + 
        '<ws:getDataset>' + 
            '<companyId>1</companyId>' + 
            '<username>fluig</username>' + 
            '<password>fluig</password>' + 
            '<name>dsFoT</name>' + 
            '<fields>' + 
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
    */
    return {
        getDataset: getDataset,
        //startSimpleProcess: startSimpleProcess
    }
    
}();