var widgetAcoes = SuperWidget.extend({
	instanceId: null,
	widgetURI: null,
	codForm: null,
	parentDocumentId: 6,
    
	bindings : {
		local : {
			'acao-add' : [ 'click_save' ]
		}
	},
	
	init: function() {
		
		widgetAcoes.widgetURI = this.widgetURI;
		widgetAcoes.instanceId = this.instanceId;

    },
    
    save : function() {
    	
    	var nome = $('#nome_' + this.instanceId, this.DOM).val();
    	var tipo = $('#tipo_' + this.instanceId, this.DOM).val();
    	var categoria = $('#categoria_' + this.instanceId, this.DOM).val();
    	
    	if( !nome || !tipo || !categoria ) {
    		FLUIGC.toast({
				title : 'Desculpe', 
				message : 'Todos os campos são obrigatósrios.',
				type : 'danger',
				timeout : "4000"
			});
    	
    	} else {    	
    	
			try{
				var result = this.saveForm();
				
				if (result==null || result.status == 'error'){
					throw "Erro ao salvar formulário: " + result.msg;
				}
				
				FLUIGC.toast({
					title: 'Sucesso ',
					message: 'Cadastro efetuado com sucesso!',
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
