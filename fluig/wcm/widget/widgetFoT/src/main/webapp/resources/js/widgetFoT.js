var widgetFoT = SuperWidget.extend({
	instanceId: null,
	widgetURI: null,
	formGatilho: 12,
	formAcao: 6,
	

    //método iniciado quando a widget é carregada
    init: function() {
    	var $this = this;
    	widgetFoT.widgetURI = this.widgetURI;
    	widgetFoT.instanceId = this.instanceId;

        this.initFoT();
        this.initGatilhos();
    },
    
    initFoT: function() {
    	this.loadComboboxDS("gatilho_" + this.instanceId, "dsGatilhos", "nome", "nome", null);
        this.loadComboboxDS("acao_" + this.instanceId, "dsAcoes", "nome", "nome", null);
    },
    
    initGatilhos: function() {
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
            'gatilho-add' : [ 'click_gatilhoAdd' ],
            'acao-add' : [ 'click_acaoAdd' ]
        },
        global: {}
    },
 
    executeAction: function(htmlElement, event) {
    },
    
    loadComboboxDS: function(comboboxName, datasetName, key, value, contraintsMatriz){
        var constraints = null;
        if (contraintsMatriz != null){
            constraints = new Array();
            var i;
            for(i=0; i<contraintsMatriz.length;i++){
                constraints.push(DatasetFactory.createConstraint(contraintsMatriz[i][0], contraintsMatriz[i][1], contraintsMatriz[i][2], ConstraintType.MUST));
            }
        }
        
        var dataset = DatasetFactory.getDataset(datasetName, null, constraints, null);
        $('#'+comboboxName+' option').remove();
        
        if (dataset.values.length == 0){
            this.addOptionToSelect(comboboxName, "-1", "Nenhum registro encontrado");
        }
        
        for (var i = 0; i < dataset.values.length; i++) {
            var row = dataset.values[i];
            this.addOptionToSelect(comboboxName, row[key], row[value]);
        }
    },
    
    addOptionToSelect: function(element, value, text){
        var combo = document.getElementById(element);
        var option = document.createElement("option");
        option.text = text;
        option.value = value;
        try {
            combo.add(option, null);
        } catch (error) {
            FLUIGC.toast({
                title : 'Desculpe', 
                message : 'Houve um problema no carregamento de alguns itens na página. Tente novamente em alguns instantes.',
                type : 'danger',
                timeout : "4000"
            });
            combo.add(option);
        }
    },
    
    gatilhoAdd: function() {
    	
    	var idGatilho = $('#idGatilho_' + this.instanceId, this.DOM).val();
    	var nome = $('#nome_' + this.instanceId, this.DOM).val();
    	var comportamento = $('#comportamento_' + this.instanceId, this.DOM).val();
    	var valor = $('#valor_' + this.instanceId, this.DOM).val();
    	if( !idGatilho || !nome || !comportamento || !valor ) {
    		FLUIGC.toast({
				title : 'Desculpe', 
				message : 'Todos os campos s\u00e3o obrigat\u00f3rios.',
				type : 'danger',
				timeout : "4000"
			});
    	
    	} else {
    		
    		try{
    			var result = this.saveForm('gatilho', this.formGatilho);
    			
    			if (result==null || result.status == 'error'){
    				throw "Erro ao salvar formul\u00e1rio: " + result.msg;
    			}
    			
    			FLUIGC.toast({
    				title: 'Sucesso ',
    				message: 'Cadastro efetuado com sucesso',
    				type: 'success',
    				timeout: 4000
    			});
    			
    			this.initFoT();
    			
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
    
    acaoAdd : function() {
    	
    	var nome = $('#nomeAc_' + this.instanceId, this.DOM).val();
    	var tipo = $('#tipoAc_' + this.instanceId, this.DOM).val();
    	var categoria = $('#categoriaAc_' + this.instanceId, this.DOM).val();
    	
    	if( !nome || !tipo || !categoria ) {
    		FLUIGC.toast({
				title : 'Desculpe', 
				message : 'Todos os campos são obrigatósrios.',
				type : 'danger',
				timeout : "4000"
			});
    	
    	} else {    	
    	
			try{
				var result = this.saveForm('acao', this.formAcao);
				
				if (result==null || result.status == 'error'){
					throw "Erro ao salvar formulário: " + result.msg;
				}
				
				FLUIGC.toast({
					title: 'Sucesso ',
					message: 'Cadastro efetuado com sucesso!',
					type: 'success',
					timeout: 4000
				});
				
				this.initFoT();
				
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
    
	saveForm: function(type, documentId){
		var $this = this;
		var result = null;
		try{
			var xmlRequest = this.getXmlRequestCreate(type, documentId);
		
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
	
	getXmlRequestCreate: function(type, documentId){
		
		var $this = this;
		var xml = '<?xml version="1.0" encoding="UTF-8"?>';
		xml += '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ws="http://ws.dm.ecm.technology.totvs.com/">';
		xml += '<soapenv:Header/><soapenv:Body>';
		xml += '<ws:create>';
		xml += '<companyId>' + WCMAPI.organizationId + '</companyId>';
		xml += '<username></username><password></password>';
		xml += '<card><item>';

		switch( type ) {
			case 'gatilho':
				xml += 	'<cardData><field>idGatilho</field><value>' + $('#idGatilho_' + $this.instanceId, $this.DOM).val() + '</value></cardData>';
				xml += 	'<cardData><field>nome</field><value>' + $('#nome_' + $this.instanceId, $this.DOM).val() + '</value></cardData>';
				xml += 	'<cardData><field>comportamento</field><value>' + $('#comportamento_' + $this.instanceId, $this.DOM).val() + '</value></cardData>';
				xml += 	'<cardData><field>valor</field><value>' + $('#valor_' + $this.instanceId, $this.DOM).val() + '</value></cardData>';
				break;
				
			case 'acao':
				xml += 	'<cardData><field>nome</field><value>' + $('#nomeAc_' + $this.instanceId, $this.DOM).val() + '</value></cardData>';
				xml += 	'<cardData><field>tipo</field><value>' + $('#tipoAc_' + $this.instanceId, $this.DOM).val() + '</value></cardData>';
				xml += 	'<cardData><field>categoria</field><value>' + $('#categoriaAc_' + $this.instanceId, $this.DOM).val() + '</value></cardData>';
				break;
		}
		
		xml += '<parentDocumentId>' + documentId + '</parentDocumentId>';
		xml += '</item></card>';
		xml += '</ws:create>';
		xml += '</soapenv:Body></soapenv:Envelope>';
		
		return xml;		
	}    

});

