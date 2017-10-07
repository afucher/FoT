var widgetGatilhos = SuperWidget.extend({
	instanceId: null,
	widgetURI: null,
    variavelNumerica: null,
    variavelCaracter: null,
	codForm: null,
	parentDocumentId: 12,    

    init: function() {

    	widgetGatilhos.widgetURI = this.widgetURI;
    	widgetGatilhos.instanceId = this.instanceId;

    	var categoriaId = '#categoria_' + this.instanceId;
    	var tipoId = 'tipo_' + this.instanceId;
    	var dom = this.DOM;
    	
    	$(categoriaId, dom).on('change', function() {
    		var opts = [];
	        switch( $(categoriaId, dom).val() ) {
	        	case 'sensores':
	        		opts = ['Dist\u00e2ncia', 'Temperatura', 'Press\u00e3o', 'Luminosidade'];
	        		break;
	        	case 'workflows':
	        		opts = ['Ao iniciar', 'Ao movimentar'];
	        		break;
	        	case 'documentos':
	        		opts = ['Ao criar', 'Ao aprovar'];
	        		break;
	        }
	        
	        var combo = document.getElementById(tipoId);
	        $('#' + tipoId, dom).children().remove().end();
	        
	        for( var i = 0; i < opts.length; i++ ) {
	        	var option = document.createElement("option");
				option.text = opts[i];
				option.value = opts[i];
				try {
					combo.add(option, null);
				} catch (error) {
					FLUIGC.toast({
						title : 'Desculpe', 
						message : 'Houve um problema no carregamento de alguns itens na p\u00e1gina. Tente novamente em alguns instantes.',
						type : 'danger',
						timeout : "4000"
					});
					combo.add(option);
				}
	        }
	    });
    },
  
    //BIND de eventos
    bindings: {
        local: {
            'execute': ['click_executeAction'],
            'gatilho-add' : [ 'click_gatilhoAdd' ]
        },
        global: {}
    },
 
    executeAction: function(htmlElement, event) {
    },
    
    gatilhoAdd: function() {
    	var nome = $('#nome_' + this.instanceId, this.DOM).val();
    	var categoria = $('#categoria_' + this.instanceId, this.DOM).val();
    	var tipo = $('#tipo_' + this.instanceId, this.DOM).val();
    	
    	if( !nome || !categoria || !tipo ) {
    		FLUIGC.toast({
				title : 'Desculpe', 
				message : 'Todos os campos s\u00e3o obrigat\u00f3rios.',
				type : 'danger',
				timeout : "4000"
			});
    	
    	} else {
    		
    		try{
    			var result = this.saveForm();
    			
    			if (result==null || result.status == 'error'){
    				throw "Erro ao salvar formul\u00e1rio: " + result.msg;
    			}
    			
    			FLUIGC.toast({
    				title: 'Sucesso ',
    				message: 'Cadastro efetuado com sucesso',
    				type: 'success',
    				timeout: 4000
    			});
    			
    		} catch (error) {
        		FLUIGC.toast({
    				title : 'Desculpe', 
    				message : 'Erro ao salvar dados',
    				type : 'danger',
    				timeout : "4000"
    			});
    		}    		
    		
    	}
    },
    
    save : function() {
		try{
			var result = this.saveForm();
			
			if (result==null || result.status == 'error'){
				throw "Erro ao salvar formul\u00e1rio: " + result.msg;
			}
			
			FLUIGC.toast({
				title: 'Sucesso ',
				message: 'Configura\u00e7\u00f5es salvas com sucesso!',
				type: 'success',
				timeout: 2000
			});
			
		} catch (error) {
			FLUIGC.message.alert({
				title: 'Erro',
			    message: error,
			    label: 'OK'
			});
		}
    },
    
	saveForm: function(){
		var $this = this;
		var result = null;
		try{
			var xmlRequest = this.getXmlRequestCreate();
		
			var parser=new DOMParser();
			var dataRequest=parser.parseFromString(xmlRequest,"text/xml");
			
			WCMAPI.Create({
				url: WCMAPI.serverURL + "/webdesk/ECMCardService?wsdl",
				contentType: "text/xml;charset=UTF-8",
				dataType: "xml",
				async: false,
				data: dataRequest,
				success: function(data){
					var xmlResp=parser.parseFromString(data.firstChild.innerHTML,"text/xml");
					console.log("Documento Publicado: " + xmlResp.getElementsByTagName("documentId")[0].innerHTML);
					$this.codForm = xmlResp.getElementsByTagName("documentId")[0].innerHTML;
					result = {status:'success'};
				},
				error: function(jqXHR, textStatus, errorThrown) {
					result = {status:'error', msg:errorThrown};
				}
			});
			
		} catch (error) {
			result = {status:'error', msg:error};
		}
		return result;		
	},
	
	getXmlRequestCreate: function(){
		var $this = this;
		var xml = '<?xml version="1.0" encoding="UTF-8"?>';
		xml += '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ws="http://ws.dm.ecm.technology.totvs.com/">';
		xml += '<soapenv:Header/><soapenv:Body>';
		xml += '<ws:create>';
		xml += '<companyId>' + WCMAPI.organizationId + '</companyId>';
		xml += '<username></username><password></password>';
		xml += '<card><item>';

		xml += 	'<cardData><field>nome</field><value>' + $('#nome_' + $this.instanceId, $this.DOM).val() + '</value></cardData>';
		xml += 	'<cardData><field>tipo</field><value>' + $('#tipo_' + $this.instanceId, $this.DOM).val() + '</value></cardData>';
		xml += 	'<cardData><field>categoria</field><value>' + $('#categoria_' + $this.instanceId, $this.DOM).val() + '</value></cardData>';
		
		xml += '<parentDocumentId>' + $this.parentDocumentId + '</parentDocumentId>';
		xml += '</item></card>';
		xml += '</ws:create>';
		xml += '</soapenv:Body></soapenv:Envelope>';
		
		return xml;		
	}    

    
});

