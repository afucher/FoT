var widgetAcoes = SuperWidget.extend({
	instanceId: null,
	widgetURI: null,
	hOrigemAprovador: [],
	codForm: null,
	versionPai: 0,
	table: null,
	parentDocumentId: 6,
	descForm: null,
	datasetName: "dsMPAprovadores",
	selectedRow: null,
    
	bindings : {
		local : {
			'aprovador-save' : [ 'click_save' ],
			'acao-add' : [ 'click_acaoAdd' ]
		}
	},	
	
	init: function() {
		
		var $this = this;
		
		widgetAcoes.widgetURI = this.widgetURI;
		widgetAcoes.instanceId = this.instanceId;

    },
    

	
	acaoAdd: function () {
		console.log('Inserido');
	},
    
    
    save : function() {
		FLUIGC.message.alert({
			title: 'Sucesso',
		    message: 'Teste',
		    label: 'OK'
		});    	
    }
	
});
