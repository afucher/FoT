var widgetGatilhos = SuperWidget.extend({
	instanceId: null,
	widgetURI: null,
    variavelNumerica: null,
    variavelCaracter: null,

    init: function() {
    	var $this = this;
    	widgetGatilhos.widgetURI = this.widgetURI;
    	widgetGatilhos.instanceId = this.instanceId

    	var categoriaId = '#categoria_' + this.instanceId;
    	var tipoId = 'tipo_' + this.instanceId;
    	var dom = this.DOM;
    	
    	$(categoriaId, dom).on('change', function() {
    		var opts = [];
	        switch( $(categoriaId, dom).val() ) {
	        	case 'sensores':
	        		opts = ['Distância', 'Temperatura', 'Pressão', 'Luminosidade'];
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
						message : 'Houve um problema no carregamento de alguns itens na página. Tente novamente em alguns instantes.',
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
            'execute': ['click_executeAction']
        },
        global: {}
    },
 
    executeAction: function(htmlElement, event) {
    }

    
});

