var widgetFoT = SuperWidget.extend({
	instanceId: null,
	widgetURI: null,
	formGatilho: 12,
	table: null,
	
    init: function() {
    	widgetFoT.widgetURI = this.widgetURI;
    	widgetFoT.instanceId = this.instanceId;

        this.initFoT();
        this.initDatatable();
    },
    
    initFoT: function() {
    	this.loadComboboxDS("workflow_" + this.instanceId, "processDefinition", "processDefinitionPK.processId", "processDescription", null);
    },
    
    initDatatable: function(){
    	
		this.table = FLUIGC.datatable('#tbGatilhos_' + this.instanceId, {
			dataRequest: [],
			renderContent: ['idGatilho', 'nome', 'comportamento', 'valor', 'ocorrencia', 'intervalo', 'workflow'],
			header: [
				{'title':'ID', 'size': 'col-md-1'},
				{'title':'Nome', 'size': 'col-md-1'},
				{'title':'Comportamento', 'size': 'col-md-2'},
				{'title':'Valor', 'size': 'col-md-1'},
				{'title':'Ocorrencia', 'size': 'col-md-2'},
				{'title':'Intervalo', 'size': 'col-md-1'},
				{'title':'Workflow', 'size': 'col-md-2'}
			],
			emptyMessage: '<div class="text-center">Nenhum gatilho encontrado</div>',
			navButtons: {
				enabled: false
			},
			search:{
				enabled: false
			},
			scroll: {
				target: '#tbGatilhos',
				enabled: true
			},
			tableStyle: 'table-bordered table-striped',
			classSelected: 'info'	        
		}, function(err, data) {

		});
		
		this.loadDatatable();
    	
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
    
	clearDatatable: function(){
		var numReg = this.table.getData().length;
		for (var i = 0; i < numReg; i++) {
			this.table.removeRow(0);
		}
	},
	
    loadDatatable: function(){
    	
    	this.clearDatatable();
    	
    	var dsGatilhos = DatasetFactory.getDataset("dsGatilhos", null, null, null);
		
		var datatable = [];
		if (dsGatilhos.values.length > 0){
			for (var i = 0; i < dsGatilhos.values.length; i++) {

				var row = dsGatilhos.values[i];
				
				var reg = {
					idGatilho: row['idGatilho'],
					nome: row['nome'],
					comportamento: row['comportamento'],
					valor: row['valor'],
					ocorrencia: row['ocorrencia'],
					intervalo: row['intervalo'],
					workflow: row['workflow']
				};
				
				datatable.push(reg);
			}			
		}
		this.table.reload(datatable);
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
    	var workflow = $('#workflow_' + this.instanceId, this.DOM).val();
    	var intervalo = $('#intervalo_' + this.instanceId, this.DOM).val();
    	var ocorrencia = $('#ocorrencia_' + this.instanceId, this.DOM).val();
    	    	
    	if( !idGatilho || !nome || !comportamento || !valor || !workflow || !intervalo || !ocorrencia) {
    		FLUIGC.toast({
				title : 'Desculpe', 
				message : 'Todos os campos s\u00e3o obrigat\u00f3rios.',
				type : 'danger',
				timeout : "4000"
			});
    	
    	} else {
    		
    		try{
    			var result = this.saveForm(this.formGatilho);
    			
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
    			this.loadDatatable();
    			
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
    
    
	saveForm: function(documentId){
		var $this = this;
		var result = null;
		try{
			var xmlRequest = this.getXmlRequestCreate(documentId);
		
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
	
	getXmlRequestCreate: function(documentId){
		
		var $this = this;
		var xml = '<?xml version="1.0" encoding="UTF-8"?>';
		xml += '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ws="http://ws.dm.ecm.technology.totvs.com/">';
		xml += '<soapenv:Header/><soapenv:Body>';
		xml += '<ws:create>';
		xml += '<companyId>' + WCMAPI.organizationId + '</companyId>';
		xml += '<username></username><password></password>';
		xml += '<card><item>';
		xml += 	'<cardData><field>idGatilho</field><value>' + $('#idGatilho_' + $this.instanceId, $this.DOM).val() + '</value></cardData>';
		xml += 	'<cardData><field>nome</field><value>' + $('#nome_' + $this.instanceId, $this.DOM).val() + '</value></cardData>';
		xml += 	'<cardData><field>comportamento</field><value>' + $('#comportamento_' + $this.instanceId, $this.DOM).val() + '</value></cardData>';
		xml += 	'<cardData><field>valor</field><value>' + $('#valor_' + $this.instanceId, $this.DOM).val() + '</value></cardData>';
		xml += 	'<cardData><field>workflow</field><value>' + $('#workflow_' + $this.instanceId, $this.DOM).val() + '</value></cardData>';
		xml += 	'<cardData><field>intervalo</field><value>' + $('#intervalo_' + $this.instanceId, $this.DOM).val() + '</value></cardData>';
		xml += 	'<cardData><field>ocorrencia</field><value>' + $('#ocorrencia_' + $this.instanceId, $this.DOM).val() + '</value></cardData>';
		xml += '<parentDocumentId>' + documentId + '</parentDocumentId>';
		xml += '</item></card>';
		xml += '</ws:create>';
		xml += '</soapenv:Body></soapenv:Envelope>';
		
		return xml;		
	}    

});

