var widgetGatilhos = SuperWidget.extend({
	instanceId: null,
	widgetURI: null,
    variavelNumerica: null,
    variavelCaracter: null,

    init: function() {
    	var $this = this;
    	widgetGatilhos.widgetURI = this.widgetURI;
    	widgetGatilhos.instanceId = this.instanceId
        
    	$('#categoria' + this.instanceId, this.DOM).on('change', function() {
	        alert( $('#categoria' + + this.instanceId).val());    
	    });
    },
  
    //BIND de eventos
    bindings: {
        local: {
            'execute': ['click_executeAction'],
            'category-changed' : [ 'change_Category' ]
        },
        global: {}
    },
 
    executeAction: function(htmlElement, event) {
    }

    
});

