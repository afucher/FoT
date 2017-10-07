var widgetAcoes = SuperWidget.extend({
	instanceId : null,
	widgetURI : null,
	hTipoAprovador : [],
	hOrigemAprovador : [],
	codForm : null,
	versionPai : 0,
	table : null,
	parentDocumentId : null,
	descForm : null,
	datasetName : "dsMPAprovadores",
	selectedRow : null,

	bindings : {
		local : {
			'acao-add' : [ 'click_acaoAdd' ]
		}
	},

	init : function() {
		var $this = this;
		widgetAcoes.widgetURI = this.widgetURI;
		widgetAcoes.instanceId = this.instanceId;
	},
	
	acaoAdd: function () {
		console.log('Inserido');
	}
});
