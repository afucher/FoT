var widgetFoT = SuperWidget.extend({
	instanceId: null,
	widgetURI: null,

    //método iniciado quando a widget é carregada
    init: function() {
    	var $this = this;
    	widgetGatilhos.widgetURI = this.widgetURI;
    	widgetGatilhos.instanceId = this.instanceId
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

