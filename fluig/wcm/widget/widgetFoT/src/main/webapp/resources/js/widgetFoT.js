var widgetFoT = SuperWidget.extend({
	instanceId: null,
	widgetURI: null,

    //método iniciado quando a widget é carregada
    init: function() {
    	var $this = this;
    	widgetGatilhos.widgetURI = this.widgetURI;
    	widgetGatilhos.instanceId = this.instanceId;

        this.loadComboboxDS("gatilho_" + this.instanceId, "dsGatilhos", "nome", "nome", null);
        this.loadComboboxDS("acao_" + this.instanceId, "dsAcoes", "nome", "nome", null);
    },
  
    //BIND de eventos
    bindings: {
        local: {
            'execute': ['click_executeAction']
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
    }

});

