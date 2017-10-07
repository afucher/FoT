var widgetAcoes = SuperWidget.extend({
	instanceId: null,
	widgetURI: null,
	hTipoAprovador: [],
	hOrigemAprovador: [],
	codForm: null,
	versionPai: 0,
	table: null,
	parentDocumentId: null,
	descForm: null,
	datasetName: "dsMPAprovadores",
	selectedRow: null,
    
	bindings : {
		local : {
			'aprovador-add' : [ 'click_insertRow' ],
			'aprovador-update' : [ 'click_editRow' ],
			'aprovador-remove' : [ 'click_removeRow' ],
			'aprovador-save' : [ 'click_save' ],
			'aprovador-edit-coligada' : [ 'click_editColigada' ],
			'aprovador-cancel' : [ 'click_cancel' ]
		}
	},	
	
	init: function() {
		
		var $this = this;
		
		widgetAcoes.widgetURI = this.widgetURI;
		widgetAcoes.instanceId = this.instanceId;

		this.loadParentDocumentData();
		
		if(this.mode == "edit"){
			console.log(">>>>>> WIDGET Aprovadores: EDIT");
			if (this.parentDocumentId !== null){
				$('#parentDocumentId_' + this.instanceId, this.DOM).val( this.parentDocumentId );
				$('#descForm_' + this.instanceId, this.DOM).val( this.descForm );
				$('#datasetName_' + this.instanceId, this.DOM).val( this.datasetName );			
			}	
			
		} else {
			
			this.initHashTipoAprovador();
			this.initHashOrigemAprovador();
			
			var constraints = [["permiteAprovadores", "true", "true"]];
			this.loadComboboxDS("processo_" + this.instanceId, "dsProcessosConfig", "codigo", "valor", constraints);
			
			//Tipos de movimentação
			var processo = $("#processo_" + this.instanceId, this.DOM).val();
			if (processo != "-1"){
				$('#tipoMovimentacao_' + $this.instanceId, $this.DOM).prop("disabled", false);
				var constraints = [["processo", processo, processo]];
				$this.loadComboboxDS("tipoMovimentacao_" + $this.instanceId, "dsProcessoMovimentacao", "codigo", "valor", constraints);
				
				if (processo == "Tm_desligamento"){
					$('#habilitarTransferencia_' + $this.instanceId, $this.DOM).prop('checked', false);
					$('#divHabilitarTransferencia_' + $this.instanceId, $this.DOM).addClass('fs-display-none');
					$('#regra_' + this.instanceId, this.DOM).val("-1");
					$('#divRegras_' + $this.instanceId, $this.DOM).addClass('fs-display-none');
				} else{
					$('#divHabilitarTransferencia_' + $this.instanceId, $this.DOM).removeClass('fs-display-none');
					$('#divRegras_' + $this.instanceId, $this.DOM).removeClass('fs-display-none');
				}
			}
			
			// Coligada
			this.loadComboboxDS("coligada_" + this.instanceId , "dsMPColigada", "codigo", "valor", null);
			this.loadUserColigada();
			var codColigada = $('#coligada_' + this.instanceId, this.DOM).val();
			
			if (codColigada == null || codColigada == undefined || codColigada == "-1"){
				FLUIGC.toast({
					title : 'Widget de Aprovadores', 
					message : 'A widget não funcionará corretamente porque o usuário não possui uma coligada. A widget só pode ser configurada por um usuário associado a uma coligada.',
					type : 'danger',
					timeout : "2000"	
				});		
				throw "Coligada não definida ou identificada.";
			}
			// Cargos
			constraints = [["codcoligada", codColigada, codColigada],
			                   ["serviceName", "readView", "readView"]];
			this.loadComboboxDS("cargo_" + this.instanceId, "dsMPCargo", "codigo", "valor", constraints);
			
			// Regras
			constraints = [["codcoligada", codColigada, codColigada]];
			this.loadComboboxDS("regra_" + this.instanceId, "dsMPQuestionario", "codigo", "valor", constraints);
			
		    this.table = FLUIGC.datatable('#tbAprovadores_' + this.instanceId, {
		        dataRequest: [],
		        renderContent: ['etapa', 'codTipoAprovador', 'tipoAprovador', 'codUsuarioFluig', 'usuarioFluig', 'codGrupoFluig', 'grupoFluig', 'coligadaLotacao', 'lotacao', 'nivelLotacao', 'origemAprovador'],
		        header: [
		            {'title':'Etapa', 'size': 'col-md-1'},
		            {'title':'Cod Aprovador', 'display': false},
		            {'title':'Tipo do Aprovador', 'size': 'col-md-2'},
		            {'title':'IDU', 'display': false},
		            {'title':'Usuário FLUIG', 'size': 'col-md-2'},
		            {'title':'IDG', 'display': false},
		            {'title':'Grupo FLUIG', 'size': 'col-md-2'},
		            {'title':'coligadaLotacao', 'display': false},
		            {'title':'Seção', 'size': 'col-md-2'},
		            {'title':'Nível Seção', 'size': 'col-md-1'},
		            {'title':'Origem Aprovador', 'size': 'col-md-2'}
		        ],
		        emptyMessage: '<div class="text-center">Nenhum aprovador encontrado</div>',
		        navButtons: {
		            enabled: false
		        },
		        search:{
		        	enabled: false
		        },
		        scroll: {
		            target: '#tbAprovadores',
		            enabled: true
		        },
		        tableStyle: 'table-bordered table-striped',
		        classSelected: 'info'	        
		    }, function(err, data) {
	
		    });  
	
			$('#processo_' + this.instanceId + 
				', #cargo_' + this.instanceId + 
				', #maoObra_' + this.instanceId + 
				', #habilitarTransferencia_' + this.instanceId, this.DOM).on('change', function() {
					
				if ($this.parentDocumentId == null){
					WCMC.messageError("Aten&ccedil;&atilde;o: Formul&aacute;rio para a widget Aprovadores n&atilde;o encontrado");
					this.value = -1;
				}else{
					$this.changeParams();
				}					
					
			});
			
			$("#coligada_" + this.instanceId, this.DOM).on('change',function() {
				var codColigada = $('#coligada_' + $this.instanceId, $this.DOM).val();
				var constraints = [
				                   ["codcoligada", codColigada, codColigada],
				                   ["serviceName", "readView", "readView"]
				                   ];
				$this.loadComboboxDS("cargo_" + $this.instanceId, "dsMPCargo", "codigo", "valor", constraints);
				
				constraints = [["codcoligada", codColigada, codColigada]];
				$this.loadComboboxDS("regra_" + $this.instanceId, "dsMPQuestionario", "codigo", "valor", constraints);				
				
				$this.changeParams();
			});
			
			
			$("#processo_" + this.instanceId, this.DOM).on('change',function() {
				var processo = this.value;
				$this.displayProcesso(processo, $this);
				
				if (processo == "-1"){
					$('#tipoMovimentacao_' + $this.instanceId, $this.DOM).prop("disabled", true);
				}else{
					$('#tipoMovimentacao_' + $this.instanceId, $this.DOM).prop("disabled", false);
					var constraints = [["processo", processo, processo]];
					$this.loadComboboxDS("tipoMovimentacao_" + $this.instanceId, "dsProcessoMovimentacao", "codigo", "valor", constraints);	
				}
				$this.changeParams();
			});
	
			$("#tipoMovimentacao_" + this.instanceId, this.DOM).on('change',function() {
				var tipoMovimentacao = $("#tipoMovimentacao_" + $this.instanceId, $this.DOM).val();
				// Habilitar transferência
				if( tipoMovimentacao == "transferencia"){
					$('#habilitarTransferencia_' + $this.instanceId, $this.DOM).prop('checked', true);
					$('#habilitarTransferencia_' + $this.instanceId, $this.DOM).prop("disabled", true);
				} else {
					$('#habilitarTransferencia_' + $this.instanceId, $this.DOM).prop("disabled", false);
				}
				
				// Regras
				if (tipoMovimentacao == "promocao" || tipoMovimentacao == "merito"){
					$('#divRegras_' + $this.instanceId, $this.DOM).removeClass('fs-display-none');
				} else{
					$('#regra_' + this.instanceId, this.DOM).val("-1");
					$('#divRegras_' + $this.instanceId, $this.DOM).addClass('fs-display-none');
				}
				
				$this.changeParams();
			});
			
			$('#tbAprovadores_' + this.instanceId, this.DOM).on('fluig.datatable.onselectrow', function() {
				if ($this.selectedRow == null && $this.table.getData().length > 0){
					$('#btnUpdate_' + $this.instanceId, $this.DOM).removeAttr('disabled');
					$('#btnRemove_' + $this.instanceId, $this.DOM).removeAttr('disabled');
				}
			});		
			
			this.displayButtons();
		}
    },
    
    displayProcesso:function (processo, $this){
    	if (processo == "Tm_desligamento"){
			$('#habilitarTransferencia_' + $this.instanceId, $this.DOM).prop('checked', false);
			$('#divHabilitarTransferencia_' + $this.instanceId, $this.DOM).addClass('fs-display-none');
			$('#regra_' + this.instanceId, this.DOM).val("-1");
			$('#divRegras_' + $this.instanceId, $this.DOM).addClass('fs-display-none');
			$('#divAprovacaoUltimaEtapa_' + $this.instanceId, $this.DOM).removeClass('fs-display-none');
			$('#divTipoMaoObra_' + $this.instanceId, $this.DOM).removeClass('fs-display-none');
		}else if (processo == "requisicao_moi"){
			$('#habilitarTransferencia_' + $this.instanceId, $this.DOM).prop('checked', false);
			$('#divHabilitarTransferencia_' + $this.instanceId, $this.DOM).addClass('fs-display-none');
			$('#regra_' + this.instanceId, this.DOM).val("-1");
			$('#divRegras_' + $this.instanceId, $this.DOM).addClass('fs-display-none');
			$('#divAprovacaoUltimaEtapa_' + $this.instanceId, $this.DOM).prop('checked', false);
			$('#divAprovacaoUltimaEtapa_' + $this.instanceId, $this.DOM).addClass('fs-display-none');
			$('#divTipoMaoObra_' + $this.instanceId, $this.DOM).addClass('fs-display-none');
		} else{
			$('#divTipoMaoObra_' + $this.instanceId, $this.DOM).removeClass('fs-display-none');
			$('#divAprovacaoUltimaEtapa_' + $this.instanceId, $this.DOM).removeClass('fs-display-none');
			$('#divHabilitarTransferencia_' + $this.instanceId, $this.DOM).removeClass('fs-display-none');
			$('#divRegras_' + $this.instanceId, $this.DOM).removeClass('fs-display-none');
		}
    },
    
    editColigada: function (){
		  $('#coligada_' + this.instanceId, this.DOM).removeAttr("disabled");
	},
	
	loadUserColigada: function(){
		var $this = this;
		var coligada = $this.getUserColigada();
		
		if (coligada != "-1"){
			$('#coligada_' + $this.instanceId, $this.DOM).val(coligada);
		}
		
		$('#coligada_' + $this.instanceId, $this.DOM).attr('disabled', '');
	},
	
	getUserColigada: function(){
		var email = WCMAPI.userEmail;
		//var email = "contax.todo@gmail.com";
//		var email = "contato@empresa.com.br";
		
		var c1 = DatasetFactory.createConstraint("functionName", "buscaFuncionarioByEmail", "buscaFuncionarioByEmail", ConstraintType.MUST);
		var c2 = DatasetFactory.createConstraint("email", email, email, ConstraintType.MUST);
		var coligada = "-1";
		
		var dataset = DatasetFactory.getDataset("dsFunctions", null, [c1,c2], null);
		if (dataset.values.length > 0){
			coligada = dataset.values[0].codcoligada;
		}
		return coligada;
	},
	
	insertRow : function() {
		var $this = this;
		$this.table.reload();
		if (this.selectedRow == null){
			var $this = this;
			this.disableButtons();
			
			var proximaEtapa = "1";
			var tableLength = this.table.getData().length;
			
			if (tableLength > 0){
				var lastRow = this.table.getRow(tableLength - 1);
				if (this.isPositiveInteger( lastRow.etapa )){
					proximaEtapa = (parseInt(lastRow.etapa) + 1);
				}
			}
			
	        var newRow = {
	            etapa: proximaEtapa,
	            codTipoAprovador: "-1",
	            tipoAprovador: this.hTipoAprovador["-1"],
	            codUsuarioFluig: "-",
	            usuarioFluig: "-",
	            codGrupoFluig: "-",
	            grupoFluig: "-",
	            coligadaLotacao: "-",
	            lotacao: "-",
	            nivelLotacao: "-",
	            codOrigemAprovador: "-1",
	            origemAprovador: this.hOrigemAprovador["-1"]
	        };
	        
	        this.table.addRow(0, newRow);
	        this.table.updateRow(0, newRow, '.template_datatable_edit_' + this.instanceId);
	
			this.verificarSolicitante();      
			this.verificarSuperiorImediato();
			
	        $('#etapa_' + this.instanceId, this.DOM).click();
	        this.disableButtons();   

	        this.selectedRow = 0;
	        
	        $('#etapa_' + this.instanceId, this.DOM).val(newRow.etapa);
		    $('#codTipoAprovador_' + this.instanceId, this.DOM).val(newRow.codTipoAprovador);
		    $('#tipoAprovador_' + this.instanceId, this.DOM).val(newRow.codTipoAprovador);
		    $('#codUsuarioFluig_' + this.instanceId, this.DOM).val(newRow.codUsuarioFluig);
		    $('#usuarioFluig_' + this.instanceId, this.DOM).val(newRow.usuarioFluig);
		    $('#codGrupoFluig_' + this.instanceId, this.DOM).val(newRow.codGrupoFluig);
		    $('#grupoFluig_' + this.instanceId, this.DOM).val(newRow.grupoFluig);
		    $('#coligadaLotacao_' + this.instanceId, this.DOM).val(newRow.coligadaLotacao);
		    $('#lotacao_' + this.instanceId, this.DOM).val(newRow.lotacao);
		    $('#nivelLotacao_' + this.instanceId, this.DOM).val(newRow.nivelLotacao);
		    $('#codOrigemAprovador_' + this.instanceId, this.DOM).val(newRow.codOrigemAprovador);
		    $('#origemAprovador_' + this.instanceId, this.DOM).val(newRow.codOrigemAprovador);
	        
			$('#tipoAprovador_' + this.instanceId, this.DOM).on('change', function() {
				$this.enableFieldsOnEdit();
			});		    
		    
		    $this.enableFieldsOnEdit();
		    
		    this.loadZoomsClick();
		    
		    $('[data-aprovador-update-confirm]', this.DOM).click(function(e) {
		        var editedRow = {
		            etapa: $('#etapa_' + $this.instanceId, $this.DOM).val(),
		            codTipoAprovador: $('#tipoAprovador_' + $this.instanceId, $this.DOM).val(),
		            tipoAprovador: $this.hTipoAprovador[ $('#tipoAprovador_' + $this.instanceId, $this.DOM).val() ],
		            codUsuarioFluig: $('#codUsuarioFluig_' + $this.instanceId, $this.DOM).val(),
		            usuarioFluig: $('#usuarioFluig_' + $this.instanceId, $this.DOM).val(),
		            codGrupoFluig: $('#codGrupoFluig_' + $this.instanceId, $this.DOM).val(),
		            grupoFluig: $('#grupoFluig_' + $this.instanceId, $this.DOM).val(),
		            coligadaLotacao: $('#coligadaLotacao_' + $this.instanceId, $this.DOM).val(),
		            lotacao: $('#lotacao_' + $this.instanceId, $this.DOM).val(),
		            nivelLotacao: $('#nivelLotacao_' + $this.instanceId, $this.DOM).val(),
		            codOrigemAprovador: $('#origemAprovador_' + $this.instanceId, $this.DOM).val(),
		            origemAprovador: $this.hOrigemAprovador[ $('#origemAprovador_' + $this.instanceId, $this.DOM).val() ]
		        };
		        $this.table.updateRow($this.selectedRow, editedRow);
		        
		        $this.selectedRow = null;
		        $this.sortTable();
		        $this.displayButtons();
		    });
		    
		    $('[data-aprovador-update-cancel]', this.DOM).click(function(e) {
		    	$this.selectedRow = null;
		    	$this.table.reload();
		    	$this.displayButtons();
		    });	    
		}
	    
	},
	
	editRow : function() {

		if (this.selectedRow == null){
			var $this = this;
			this.disableButtons();
			this.selectedRow = this.table.selectedRows()[0];
			
		    var row = this.table.getRow(this.selectedRow);
		    this.table.updateRow(this.selectedRow, row, '.template_datatable_edit_' + this.instanceId);
		    
		    this.verificarSolicitante();
		    
		    $('#etapa_' + this.instanceId, this.DOM).val(row.etapa);
		    $('#codTipoAprovador_' + this.instanceId, this.DOM).val(row.codTipoAprovador);
		    $('#tipoAprovador_' + this.instanceId, this.DOM).val(row.codTipoAprovador);
		    $('#codUsuarioFluig_' + this.instanceId, this.DOM).val(row.codUsuarioFluig);
		    $('#usuarioFluig_' + this.instanceId, this.DOM).val(row.usuarioFluig);
		    $('#codGrupoFluig_' + this.instanceId, this.DOM).val(row.codGrupoFluig);
		    $('#grupoFluig_' + this.instanceId, this.DOM).val(row.grupoFluig);
		    $('#coligadaLotacao_' + this.instanceId, this.DOM).val(row.coligadaLotacao);
		    $('#lotacao_' + this.instanceId, this.DOM).val(row.lotacao);
		    $('#nivelLotacao_' + this.instanceId, this.DOM).val(row.nivelLotacao);
		    $('#codOrigemAprovador_' + this.instanceId, this.DOM).val(row.codOrigemAprovador);
		    $('#origemAprovador_' + this.instanceId, this.DOM).val(row.codOrigemAprovador);
		    
			$('#tipoAprovador_' + this.instanceId, this.DOM).on('change', function() {
				$this.enableFieldsOnEdit();
			});	    
		    
		    this.enableFieldsOnEdit();
		    
		    this.loadZoomsClick();
		    
		    $('[data-aprovador-update-confirm]', this.DOM).click(function(e) {
		        var editedRow = {
		            etapa: $('#etapa_' + $this.instanceId, $this.DOM).val(),
		            codTipoAprovador: $('#tipoAprovador_' + $this.instanceId, $this.DOM).val(),
		            tipoAprovador: $this.hTipoAprovador[ $('#tipoAprovador_' + $this.instanceId, $this.DOM).val() ],
		            codUsuarioFluig: $('#codUsuarioFluig_' + $this.instanceId, $this.DOM).val(),
		            usuarioFluig: $('#usuarioFluig_' + $this.instanceId, $this.DOM).val(),
		            codGrupoFluig: $('#codGrupoFluig_' + $this.instanceId, $this.DOM).val(),
		            grupoFluig: $('#grupoFluig_' + $this.instanceId, $this.DOM).val(),
		            coligadaLotacao: $('#coligadaLotacao_' + $this.instanceId, $this.DOM).val(),
		            lotacao: $('#lotacao_' + $this.instanceId, $this.DOM).val(),
		            nivelLotacao: $('#nivelLotacao_' + $this.instanceId, $this.DOM).val(),
		            codOrigemAprovador: $('#origemAprovador_' + $this.instanceId, $this.DOM).val(),
		            origemAprovador: $this.hOrigemAprovador[ $('#origemAprovador_' + $this.instanceId, $this.DOM).val() ]
		        };
		        $this.table.updateRow($this.selectedRow, editedRow);
		        
		        $this.selectedRow = null;
		        $this.sortTable();
		        $this.displayButtons();
		    });
		    
		    $('[data-aprovador-update-cancel]', this.DOM).click(function(e) {
		    	$this.selectedRow = null;
		    	$this.table.reload();
		    	$this.displayButtons();
		    });
	    
		}
	},
	
	removeRow : function() {
		this.table.removeRow(this.table.selectedRows()[0]);
		this.sortTable();
		this.displayButtons();
	},
	
	save : function() {
		try {
			
			var tipoMovimentacao = $("#tipoMovimentacao_" + this.instanceId, this.DOM).val();
			if (tipoMovimentacao == "promocao" || tipoMovimentacao == "merito"){
				if ($('#regra_' + this.instanceId, this.DOM).val() < 0){
					throw "Campo <strong>Regra</strong> não informado";
				}
			}
			
			this.validateTableData();
			
			var result = this.saveForm();
			
			if (result==null || result.status == 'error'){
				throw "Erro ao salvar formulário: " + result.msg;
			}
			
			FLUIGC.message.alert({
				title: 'Sucesso',
			    message: 'Lista de aprovadores cadastrada com sucesso',
			    label: 'OK'
			});
		} catch (error) {
			FLUIGC.message.alert({
				title: 'Erro',
			    message: error,
			    label: 'OK'
			});
		}
	},
	
	cancel : function() {
		this.loadDatatable();
	},

//	loadProcessos: function(){
//		var $this = this;
//		var c1 = DatasetFactory.createConstraint("categoryId", "Movimentação de Pessoal", "Movimentação de Pessoal", ConstraintType.MUST, false);
//		var constraints = new Array(c1);
//		var fields = new Array("processDefinitionPK.processId","processDescription");
//		var sortingFields = new Array("processDefinitionPK.processId");
//		
//		var dataset = DatasetFactory.getDataset("processDefinition", fields, constraints, sortingFields);
//		
//		for (var i = 0; i < dataset.values.length; i++) {
//			var row = dataset.values[i];
//			this.addOptionToSelect("processo_" + $this.instanceId, row['processDefinitionPK.processId'], row['processDescription']);
//		}
//	},
	
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
	
	verificarSolicitante: function(){
		var $this = this;
		var processo = $('#processo_' + $this.instanceId, $this.DOM).val();
		var habilitaTransferencia = $('#habilitarTransferencia_' + $this.instanceId, $this.DOM).is(':checked');
		
		if (habilitaTransferencia){
			if ($("#origemAprovador_" + $this.instanceId + " option[value='3']", $this.DOM).length <= 0){
				this.addOptionToSelect("origemAprovador", "3", "Solicitante");
			}
		} else {
			$("#origemAprovador_" + $this.instanceId + " option[value='3']", $this.DOM).remove();
		} 		
		
		if ( processo == "requisicao_moi"){
			$("#origemAprovador_" + $this.instanceId + " option[value='2']", $this.DOM).remove();
			$("#origemAprovador_" + $this.instanceId + " option[value='3']", $this.DOM).remove();
		}else{
			if ($("#origemAprovador_" + $this.instanceId + " option[value='2']", $this.DOM).length <= 0){
				this.addOptionToSelect("origemAprovador", "2", "Cedente");
			}
			if (habilitaTransferencia){
				if ($("#origemAprovador_" + $this.instanceId + " option[value='3']", $this.DOM).length <= 0){
					this.addOptionToSelect("origemAprovador", "3", "Solicitante");
				}
			}
		}
		
	},
	
	verificarSuperiorImediato: function(){
		var $this = this;
		if ( $('#processo_' + $this.instanceId, $this.DOM).val() == "requisicao_moi"){
			$("#tipoAprovador_" + $this.instanceId + " option[value='4']", $this.DOM).remove();
		}else{
			if ($("#tipoAprovador_" + $this.instanceId + " option[value='4']", $this.DOM).length <= 0){
				this.addOptionToSelect("tipoAprovador", "4", "Superior Imediato");
			}
		}
	},
	
	changeParams: function(){
		var $this = this;
		if (($('#processo_' + $this.instanceId, $this.DOM).val() != "-1")
				&& ( $('#tipoMovimentacao_' + $this.instanceId, $this.DOM).val() != "-1" )
				&& ($('#cargo_' + $this.instanceId, $this.DOM).val() != "-1")){
			this.loadDatatable();
		} else {
			this.clearDatatable();
		}		
	},
	
	loadParentDocumentData: function(){
		var $this = this;
		
		var companyId = WCMAPI.getTenantId();
		
		var c1 = DatasetFactory.createConstraint("distinct", true, true, ConstraintType.MUST, false);
		var c2 = DatasetFactory.createConstraint("companyId", companyId, companyId, ConstraintType.MUST, false);
		var c3 = DatasetFactory.createConstraint("datasetName", $this.datasetName, $this.datasetName, ConstraintType.MUST, false);
		
		var dataset = DatasetFactory.getDataset("dsFormList", null, [c1,c2,c3], null);
		if (dataset.values.length > 0){
			$this.parentDocumentId = dataset.values[0]["documentId"];
			$this.descForm = dataset.values[0]["documentDescription"];
		}
		
	},	
	
	displayButtons: function(){
		var $this = this;
		if (($('#processo_' + $this.instanceId, $this.DOM).val() == "-1")
				|| ( $('#tipoMovimentacao_' + $this.instanceId, $this.DOM).val() == "-1" )
				|| ( $('#cargo_' + $this.instanceId, $this.DOM).val() == "-1")  ){
			this.disableButtons();
		
		} else {
			
			$('#btnSave_' + $this.instanceId, $this.DOM).removeAttr('disabled');
			$('#btnCancel_' + $this.instanceId, $this.DOM).removeAttr('disabled');
			$('#btnAdd_' + $this.instanceId, $this.DOM).removeAttr('disabled');
			
			if (this.table.getData().length == 0){
				$('#btnUpdate_' + $this.instanceId, $this.DOM).attr('disabled', 'true');
				$('#btnRemove_' + $this.instanceId, $this.DOM).attr('disabled', 'true');
			}
			
			if ($this.selectedRow != null){
				$('#btnUpdate_' + $this.instanceId, $this.DOM).removeAttr('disabled');
				$('#btnRemove_' + $this.instanceId, $this.DOM).removeAttr('disabled');
			} else {
				$('#btnUpdate_' + $this.instanceId, $this.DOM).attr('disabled', 'true');
				$('#btnRemove_' + $this.instanceId, $this.DOM).attr('disabled', 'true');			
			}
			
		}
	},
	
	disableButtons: function(){
		var $this = this;
		$('#btnAdd_' + $this.instanceId, $this.DOM).attr('disabled', 'true');
		$('#btnRemove_' + $this.instanceId, $this.DOM).attr('disabled', 'true');
		$('#btnUpdate_' + $this.instanceId, $this.DOM).attr('disabled', 'true');
		$('#btnSave_' + $this.instanceId, $this.DOM).attr('disabled', 'true');
		$('#btnCancel_' + $this.instanceId, $this.DOM).attr('disabled', 'true');	
	},
	
	clearDatatable: function(){
		var numReg = this.table.getData().length;
		for (var i = 0; i < numReg; i++) {
			this.table.removeRow(0);
		}
		this.displayButtons();
	},
	
	loadDatatable: function(){
		var $this = this;
		$this.codForm = null;
		$this.versionPai = 0;
		
		console.log(">>>>>>> loadDatatable <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<");
		
		this.clearDatatable();
		
		var datasetNameConsultaFilho = "dsConsultaDatasetFilho";
		
		var idProcesso = $('#processo_' + $this.instanceId, $this.DOM).val();
		var tipoMov = $('#tipoMovimentacao_' + $this.instanceId, $this.DOM).val();
		var maoObra = $('#maoObra_' + $this.instanceId, $this.DOM).val();
		var cargo = $('#cargo_' + $this.instanceId, $this.DOM).val();
		var isOpTransf = $('#habilitarTransferencia_' + $this.instanceId, $this.DOM).is(':checked');
		
		console.log("processo: " + idProcesso);
		console.log("tipoMovimentacao: " + tipoMov);
		console.log("cargo: " + cargo);
		console.log("maoObra: " + maoObra);
		console.log("isOpTransf: " + isOpTransf);
		
		var c1 = DatasetFactory.createConstraint("idProcesso", idProcesso, idProcesso, ConstraintType.MUST, false);
		var c2 = DatasetFactory.createConstraint("tipoMovimentacao", tipoMov, tipoMov, ConstraintType.MUST, false);
		var c3 = DatasetFactory.createConstraint("maoObra", maoObra, maoObra, ConstraintType.MUST, false);
		var c4 = DatasetFactory.createConstraint("cargo", cargo, cargo, ConstraintType.MUST, false);
		var c5 = DatasetFactory.createConstraint("habilitarTransferencia", isOpTransf, isOpTransf, ConstraintType.MUST, false);
		var c6 = DatasetFactory.createConstraint("metadata#active", true, true, ConstraintType.MUST, false);
		
		var constraints = [c1,c2,c3,c4,c5,c6];
		
		var datasetPrincipal = DatasetFactory.getDataset($this.datasetName, null, constraints, null);
		
	    console.log(">>>>>  " + $this.datasetName + " length: " + datasetPrincipal.values.length);
	    
	    $('#regra_' + $this.instanceId, $this.DOM).val("-1");
	    $('#permiteEdicaoUltAprov_' + $this.instanceId, $this.DOM).prop('checked', false);
	    
	    var datatable = [];
	    if (datasetPrincipal.values.length > 0){
	    
		    var last = datasetPrincipal.values.length - 1;
			
		    var rowPrincipal = datasetPrincipal.values[last];
		    $this.codForm = rowPrincipal['metadata#id'];
		    $this.versionPai = rowPrincipal['versionPai'];
		    
		    console.log("metadata#id = " + $this.codForm);
		    console.log("metadata#version = " + rowPrincipal['metadata#version']);
		    console.log("versionPai = " + $this.versionPai);
		    
		    $('#regra_' + $this.instanceId, $this.DOM).val( rowPrincipal['regra'] );
		    
		    if (rowPrincipal['permiteEdicaoUltAprov'] == "true"){
		    	$('#permiteEdicaoUltAprov_' + $this.instanceId, $this.DOM).prop('checked', true);
		    } else {
		    	$('#permiteEdicaoUltAprov_' + $this.instanceId, $this.DOM).prop('checked', false);
		    }
		    
		    var cf1 = DatasetFactory.createConstraint("datasetParent", $this.datasetName, $this.datasetName, ConstraintType.MUST, false);
		    var cf2 = DatasetFactory.createConstraint("tablename", "nivel_aprovacao", "nivel_aprovacao", ConstraintType.MUST, false);
		    var cf3 = DatasetFactory.createConstraint("metadata#id", $this.codForm, $this.codForm, ConstraintType.MUST, false);
		    var cf4 = DatasetFactory.createConstraint("metadata#version", rowPrincipal['metadata#version'], rowPrincipal['metadata#version'], ConstraintType.MUST, false);
		    var cf5 = DatasetFactory.createConstraint("vPai", $this.versionPai, $this.versionPai, ConstraintType.MUST, false);
		    var constraintsFilhos = [cf1,cf2,cf3,cf4,cf5];
		    
		    var fields = [ 'etapa', 'tipoAprovador', 'origemAprovador', 'usuarioFluig', 'grupoFluig', 'lotacao', 'nivelLotacao' ];
		    
		    var datasetFilho = DatasetFactory.getDataset(datasetNameConsultaFilho, fields, constraintsFilhos, null);
		    
		    console.log(">>>>>  " + datasetNameConsultaFilho + " length: " + datasetFilho.values.length);
		    
		    this.versionPai = rowPrincipal['metadata#version'];
		    
		    for (var i = 0; i < datasetFilho.values.length; i++) {
		    	
		    	var row = datasetFilho.values[i];
		    	var codTipoAprovador = row['tipoAprovador'];
		    	var codOrigemAprovador = row['origemAprovador'];
		    	
		    	var reg = {
		    			etapa: row['etapa'],
		    			codTipoAprovador: codTipoAprovador,
		    			tipoAprovador: this.hTipoAprovador[codTipoAprovador],
		    			codUsuarioFluig: (row['usuarioFluig'] == "") ? "-" : row['usuarioFluig'],
		    			usuarioFluig: this.getUserNameById( row['usuarioFluig'] ),
		    			codGrupoFluig: (row['grupoFluig'] == "") ? "-" : row['grupoFluig'],
		    			grupoFluig: this.getGroupNameById( row['grupoFluig'] ),
		    			lotacao: (row['lotacao'] == "") ? "-" : row['lotacao'],
    					coligadaLotacao: (row['coligadaLotacao'] == "") ? "-" : row['coligadaLotacao'],
		    			nivelLotacao: (row['nivelLotacao'] == "") ? "-" : row['nivelLotacao'],
		    			codOrigemAprovador: codOrigemAprovador,
		    			origemAprovador: this.hOrigemAprovador[codOrigemAprovador]
		    		};

		    	datatable.push(reg);
		    }
		}
	    this.table.reload(datatable);
	    this.displayButtons();
	    
	},
	
	isPositiveInteger: function(value){
		return /^[0-9]+$/.test( value ) && value > 0;	
	},
	
	saveForm: function(){
		var $this = this;
		var result = null;
		try{
			var xmlRequest = ($this.codForm == null) ? this.getXmlRequestCreate() : this.getXmlRequestUpdate();
		
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
					$this.versionPai = xmlResp.getElementsByTagName("version")[0].innerHTML;
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
	
	getDescricaoForm: function(){
		var $this = this;
		var desc = $( "#processo_" + $this.instanceId + " option:selected", $this.DOM ).text() + ", ";
		desc += $( "#tipoMovimentacao_" + $this.instanceId + " option:selected", $this.DOM ).text() + ", ";
		desc += $( "#cargo_" + $this.instanceId + " option:selected", $this.DOM ).text() + ", ";
		desc += $( "#maoObra_" + $this.instanceId + " option:selected", $this.DOM ).text() + ", ";
		
		if ($('#habilitarTransferencia_' + $this.instanceId, $this.DOM).is(':checked')){
			desc += "COM transferência";
		} else {
			desc += "SEM transferência";
		}
		return desc;		
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

		xml += 	'<cardData><field>descricao</field><value>' + $this.getDescricaoForm() + '</value></cardData>';
		xml += 	'<cardData><field>idProcesso</field><value>' + $('#processo_' + $this.instanceId, $this.DOM).val() + '</value></cardData>';
		xml += 	'<cardData><field>coligada</field><value>' + $('#coligada_' + $this.instanceId, $this.DOM).val() + '</value></cardData>';
		xml += 	'<cardData><field>tipoMovimentacao</field><value>' + $('#tipoMovimentacao_' + $this.instanceId, $this.DOM).val() + '</value></cardData>';
		xml += 	'<cardData><field>cargo</field><value>' + $('#cargo_' + $this.instanceId, $this.DOM).val() + '</value></cardData>';
		xml += 	'<cardData><field>maoObra</field><value>' + $('#maoObra_' + $this.instanceId, $this.DOM).val() + '</value></cardData>';
		xml += 	'<cardData><field>habilitarTransferencia</field><value>' + $('#habilitarTransferencia_' + $this.instanceId, $this.DOM).is(':checked') + '</value></cardData>';
		xml += 	'<cardData><field>permiteEdicaoUltAprov</field><value>' + $('#permiteEdicaoUltAprov_' + $this.instanceId, $this.DOM).is(':checked') + '</value></cardData>';
		xml += 	'<cardData><field>regra</field><value>' + $('#regra_' + $this.instanceId, $this.DOM).val() + '</value></cardData>';
		xml += 	'<cardData><field>versionPai</field><value>' + $this.versionPai + '</value></cardData>';
		
		var rows = this.table.getData();
		for (var i=0; i < rows.length; i++) {
			xml += 	'<cardData><field>etapa___' + (i+1) + '</field><value>' + rows[i].etapa + '</value></cardData>';
			xml += 	'<cardData><field>tipoAprovador___' + (i+1) + '</field><value>' + rows[i].codTipoAprovador + '</value></cardData>';
			xml += 	'<cardData><field>usuarioFluig___' + (i+1) + '</field><value>' + rows[i].codUsuarioFluig + '</value></cardData>';
			xml += 	'<cardData><field>grupoFluig___' + (i+1) + '</field><value>' + rows[i].codGrupoFluig + '</value></cardData>';
			xml += 	'<cardData><field>coligadaLotacao___' + (i+1) + '</field><value>' + rows[i].coligadaLotacao + '</value></cardData>';
			xml += 	'<cardData><field>lotacao___' + (i+1) + '</field><value>' + rows[i].lotacao + '</value></cardData>';
			xml += 	'<cardData><field>nivelLotacao___' + (i+1) + '</field><value>' + rows[i].nivelLotacao + '</value></cardData>';
			xml += 	'<cardData><field>origemAprovador___' + (i+1) + '</field><value>' + rows[i].codOrigemAprovador + '</value></cardData>';
			xml += 	'<cardData><field>vPai___' + (i+1) + '</field><value>' + $this.versionPai + '</value></cardData>';
		}
		
		xml += '<parentDocumentId>' + $this.parentDocumentId + '</parentDocumentId>';
		xml += '</item></card>';
		xml += '</ws:create>';
		xml += '</soapenv:Body></soapenv:Envelope>';
		
		return xml;		
	},
	
	getXmlRequestUpdate: function(){
		var $this = this;
		var xml = '<?xml version="1.0" encoding="UTF-8"?>';
		xml += '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ws="http://ws.dm.ecm.technology.totvs.com/">';
		xml += '<soapenv:Header/><soapenv:Body>';
		xml += '<ws:updateCardData>';
		xml += '<companyId>' + WCMAPI.organizationId + '</companyId>';
		xml += '<username></username><password></password>';
		xml += '<cardId>' + $this.codForm + '</cardId>';
		xml += '<cardData>';

		xml += 	'<item><field>descricao</field><value>' + $this.getDescricaoForm() + '</value></item>';
		xml += 	'<item><field>coligada</field><value>' + $('#coligada_' + $this.instanceId, $this.DOM).val() + '</value></item>';
		xml += 	'<item><field>idProcesso</field><value>' + $('#processo_' + $this.instanceId, $this.DOM).val() + '</value></item>';
		xml += 	'<item><field>tipoMovimentacao</field><value>' + $('#tipoMovimentacao_' + $this.instanceId, $this.DOM).val() + '</value></item>';
		xml += 	'<item><field>cargo</field><value>' + $('#cargo_' + $this.instanceId, $this.DOM).val() + '</value></item>';
		xml += 	'<item><field>maoObra</field><value>' + $('#maoObra_' + $this.instanceId, $this.DOM).val() + '</value></item>';
		xml += 	'<item><field>habilitarTransferencia</field><value>' + $('#habilitarTransferencia_' + $this.instanceId, $this.DOM).is(':checked') + '</value></item>';
		xml += 	'<item><field>permiteEdicaoUltAprov</field><value>' + $('#permiteEdicaoUltAprov_' + $this.instanceId, $this.DOM).is(':checked') + '</value></item>';
		xml += 	'<item><field>regra</field><value>' + $('#regra_' + $this.instanceId, $this.DOM).val() + '</value></item>';
		xml += 	'<item><field>versionPai</field><value>' + $this.versionPai + '</value></item>';
		
		var rows = this.table.getData();
		for (var i=0; i < rows.length; i++) {
			
			xml += 	'<item><field>etapa___' + (i+1) + '</field><value>' + rows[i].etapa + '</value></item>';
			xml += 	'<item><field>tipoAprovador___' + (i+1) + '</field><value>' + rows[i].codTipoAprovador + '</value></item>';
			xml += 	'<item><field>usuarioFluig___' + (i+1) + '</field><value>' + rows[i].codUsuarioFluig + '</value></item>';
			xml += 	'<item><field>grupoFluig___' + (i+1) + '</field><value>' + rows[i].codGrupoFluig + '</value></item>';
			xml += 	'<item><field>coligadaLotacao___' + (i+1) + '</field><value>' + rows[i].coligadaLotacao + '</value></item>';
			xml += 	'<item><field>lotacao___' + (i+1) + '</field><value>' + rows[i].lotacao + '</value></item>';
			xml += 	'<item><field>nivelLotacao___' + (i+1) + '</field><value>' + rows[i].nivelLotacao + '</value></item>';
			xml += 	'<item><field>origemAprovador___' + (i+1) + '</field><value>' + rows[i].codOrigemAprovador + '</value></item>';
			xml += 	'<item><field>vPai___' + (i+1) + '</field><value>' + $this.versionPai + '</value></item>';
		}	

		xml += '</cardData>';
		xml += '</ws:updateCardData>';
		xml += '</soapenv:Body></soapenv:Envelope>';
		
		return xml;		
	},
	
	disableAllEditFields: function(){
		var $this = this;
		$('#usuarioFluig_' + $this.instanceId, $this.DOM).attr('readonly', '');
		$('#grupoFluig_' + $this.instanceId, $this.DOM).attr('readonly', '');
		$('#lotacao_' + $this.instanceId, $this.DOM).attr('readonly', '');
		$('#nivelLotacao_' + $this.instanceId, $this.DOM).attr('readonly', '');
		$('#origemAprovador_' + $this.instanceId, $this.DOM).attr('readonly', '');
	},
	
	enableFieldsOnEdit: function(){
		var $this = this;
		this.disableAllEditFields();
		
		switch ($('#tipoAprovador_' + $this.instanceId, $this.DOM).val()){
		case "1":
			$('#usuarioFluig_' + $this.instanceId, $this.DOM).removeAttr('readonly');
			this.ignoreClearFieldsOnEdit(['codUsuarioFluig','usuarioFluig']);
			break;
		case "2":
			$('#grupoFluig_' + $this.instanceId, $this.DOM).removeAttr('readonly');
			this.ignoreClearFieldsOnEdit(['codGrupoFluig','grupoFluig']);
			break;
		case "3":
			$('#lotacao_' + $this.instanceId, $this.DOM).removeAttr('readonly');
			this.ignoreClearFieldsOnEdit(['coligadaLotacao','lotacao']);
			break;
		case "4":
			$('#origemAprovador_' + $this.instanceId, $this.DOM).removeAttr('readonly');
			this.ignoreClearFieldsOnEdit(['origemAprovador']);
			break;
		case "5":
			$('#nivelLotacao_' + $this.instanceId, $this.DOM).removeAttr('readonly');
			$('#origemAprovador_' + $this.instanceId, $this.DOM).removeAttr('readonly');
			this.ignoreClearFieldsOnEdit(['lotacao','nivelLotacao','origemAprovador']);
			break;
		case "6":
			$('#origemAprovador_' + $this.instanceId, $this.DOM).removeAttr('readonly');
			this.ignoreClearFieldsOnEdit(['origemAprovador']);
			break;
		default:
			this.ignoreClearFieldsOnEdit(null);
			this.disableAllEditFields();
			break;
		
		}
	},
	
	ignoreClearFieldsOnEdit: function(ignoreFields){
		var $this = this;
		var fields = ['codUsuarioFluig', 'usuarioFluig', 'codGrupoFluig', 'grupoFluig', 'coligadaLotacao', 'lotacao', 'nivelLotacao'];
		
		for (var i = 0; i < fields.length; i++){
			if (ignoreFields == null ){
				$('#' + fields[i] + '_' + $this.instanceId, $this.DOM).val('-');
			
			} else {
				if (ignoreFields.indexOf( fields[i] ) == -1){
					$('#' + fields[i] + '_' + $this.instanceId, $this.DOM).val('-');
				}
			}
		}
		
		if	(ignoreFields == null || ignoreFields.indexOf("origemAprovador") == -1){
			$('#origemAprovador_' + $this.instanceId, $this.DOM).val('-1');
		}
	},
	
	loadZoomsClick: function(){
		var $this = this;
		var host_port = window.location.protocol+ "//" + window.location.host;
		
		// Usuario Fluig
		$('#btnZoomUser_' + $this.instanceId, $this.DOM).on('click', function() {
			
			if ($('#tipoAprovador_' + $this.instanceId, $this.DOM).val() == "1"){
				$this.overideZoomItem($this);
				window.open(host_port + '/webdesk/zoom.jsp?datasetId=colleague' +
						'&dataFields=colleagueName,Nome,colleaguePK.colleagueId,Codigo' +
						'&resultFields=colleaguePK.colleagueId,colleagueName' +
						'&type=lstUsuarios_' + $this.instanceId + '&title=Lista de Usuários&likeField=active&likeValue=true');
			} else {
				FLUIGC.toast({
					title : '', 
					message : 'Campo "Tipo do Aprovador" indicado não é do tipo ' + $this.hTipoAprovador["1"],
					type : 'danger',
					timeout : "4000"	
				});			
			}
			
		});
		
		$('#usuarioFluig_' + $this.instanceId, $this.DOM).on('focus', function() {
			$('#btnZoomUser_' + $this.instanceId, $this.DOM).click();
			$('#usuarioFluig_' + $this.instanceId, $this.DOM).blur();
		});	
		
		
		// Grupo Fluig
		$('#btnZoomGroup_' + $this.instanceId, $this.DOM).on('click', function() {
			
			if ($('#tipoAprovador_' + $this.instanceId, $this.DOM).val() == "2"){
				$this.overideZoomItem($this);
				window.open(host_port + '/webdesk/zoom.jsp?datasetId=group' +
						'&dataFields=groupDescription,Nome,groupPK.groupId,Codigo' +
						'&resultFields=groupPK.groupId,groupDescription' +
						'&type=lstGrupos_' + $this.instanceId + '&title=Lista de Grupos');
			} else {
				FLUIGC.toast({
					title : '', 
					message : 'Campo "Tipo do Aprovador" indicado não é do tipo ' + $this.hTipoAprovador["2"],
					type : 'danger',
					timeout : "4000"	
				});				
			}
			
		});
		
		$('#grupoFluig_' + $this.instanceId, $this.DOM).on('focus', function() {
			$('#btnZoomGroup_' + $this.instanceId, $this.DOM).click();
			$('#grupoFluig_' + $this.instanceId, $this.DOM).blur();
		});		
		
		// Lotação
		$('#btnModalLotacao_' + $this.instanceId, $this.DOM).on('click', function() {
			if ($('#tipoAprovador_' + $this.instanceId, $this.DOM).val() == "3"){
		    	var dialog = null;
		    	dialog = $( '#dialog-form_' + $this.instanceId ).dialog({
	    	      autoOpen: false,
	    	      title: 'Seção',
	    	      height: 'auto',
	    	      width: '75%',
	    	      modal: true,
	    	      buttons: [
		                {
		                	text: "OK",
		                	click: function(){
		                		var lotacao = $this.getUltimaLotacaoPreenchida();
		                		var coligadaLotacao = $this.getColigadaLotacaoPreenchida();
		                		if ( $this.existeChefeSecao(lotacao, coligadaLotacao)){
		                			$('#coligadaLotacao_' + $this.instanceId, $this.DOM).val( coligadaLotacao );
		                			$('#lotacao_' + $this.instanceId, $this.DOM).val( lotacao );
		                			dialog.dialog( "close" );
		                		} else {
		                			FLUIGC.toast({
		                				title : '', 
		                				message : 'Seção informada não possui chefe cadastrado',
		                				type : 'danger',
		                				timeout : "4000"	
		                			});		                			
		                		}
		    	        	}
		                },
		                {
		                	text: "Cancelar",
		                	click: function(){
			    	        	dialog.dialog( "close" );
		    	        	}
		                }
	    	      ],
	    	      beforeClose: function( event, ui ) {
	    	  		 var campos = ["coligadaLotacaoModal", "empresa", "presidencia","diretoriaEx", "diretoria", "matrizFilial", "gerencia",
	    			              "coordenacao", "supervisao", "produto"];
	    			 $this.cleanAndLockFields(campos, $this.instanceId, '#dialog-form_' + $this.instanceId);
	    	      }
	    	      
		    	});			
				
		    	dialog.dialog( "open" );
		    	
			} else {
				FLUIGC.toast({
					title : '', 
					message : 'Campo "Tipo do Aprovador" indicado não é do tipo ' + $this.hTipoAprovador["3"],
					type : 'danger',
					timeout : "4000"	
				});				
			}
			
		});
		
		$('#lotacao_' + $this.instanceId, $this.DOM).on('focus', function() {
			$('#btnModalLotacao_' + $this.instanceId, $this.DOM).click();
			$('#lotacao_' + $this.instanceId, $this.DOM).blur();
		});		

		
	    //******EVENTOS DO MODAL DE TRANSFERENCIA ************
		$('#coligadaLotacaoModal_' + $this.instanceId, $this.DOM).on('focus', function() {
			var type = "coligadaProposta_" + $this.instanceId;
			$this.zoomBuscaColigada(type);
			$('#coligadaLotacaoModal_' + $this.instanceId, '#dialog-form_' + $this.instanceId).blur();
		});

		$('#empresa_' + $this.instanceId, $this.DOM).on('focus', function() {
			var coligada = $('#coligadaLotacaoModal_' + $this.instanceId).val();
			if (coligada == ""){
//				FLUIGC.toast({
//					title : 'Atenção',
//					message : 'Selecione uma coligada.',
//					type : 'danger',
//					timeout : 3000
//				});
//				return;
			}else{
				$this.zoomBuscaSecao($this.buildSecao(0), 0, "Empresa", "empresa_" + $this.instanceId, coligada);
			}
			$('#empresa_' + $this.instanceId, '#dialog-form_' + $this.instanceId).blur();
			
		});	
		$('#presidencia_' + $this.instanceId, $this.DOM).on('focus', function() {
			var coligada = $('#coligadaLotacaoModal_' + $this.instanceId).val();
			$this.zoomBuscaSecao($this.buildSecao(2), 1, "Presidência", "presidencia_" + $this.instanceId, coligada);
			$('#presidencia_' + $this.instanceId, '#dialog-form_' + $this.instanceId).blur();
		});	
		$('#diretoriaEx_' + $this.instanceId, $this.DOM).on('focus', function() {
			var coligada = $('#coligadaLotacaoModal_' + $this.instanceId).val();
			$this.zoomBuscaSecao($this.buildSecao(5), 2, "Diretoria Executiva", "diretoriaEx_" + $this.instanceId, coligada);
			$('#diretoriaEx_' + $this.instanceId, '#dialog-form_' + $this.instanceId).blur();
		});	
		$('#diretoria_' + $this.instanceId, $this.DOM).on('focus', function() {
			var coligada = $('#coligadaLotacaoModal_' + $this.instanceId).val();
			$this.zoomBuscaSecao($this.buildSecao(8), 3, "Diretoria", "diretoria_" + $this.instanceId, coligada);
			$('#diretoria_' + $this.instanceId, '#dialog-form_' + $this.instanceId).blur();
		});	
		$('#matrizFilial_' + $this.instanceId, $this.DOM).on('focus', function() {
			var coligada = $('#coligadaLotacaoModal_' + $this.instanceId).val();
			$this.zoomBuscaSecao($this.buildSecao(11), 4, "Matriz/Filial", "matrizFilial_" + $this.instanceId, coligada);
			$('#matrizFilial_' + $this.instanceId, '#dialog-form_' + $this.instanceId).blur();
		});	
		$('#gerencia_' + $this.instanceId, $this.DOM).on('focus', function() {
			var coligada = $('#coligadaLotacaoModal_' + $this.instanceId).val();
			$this.zoomBuscaSecao($this.buildSecao(14), 5, "Gerência", "gerencia_" + $this.instanceId, coligada);
			$('#gerencia_' + $this.instanceId, '#dialog-form_' + $this.instanceId).blur();
		});	
		$('#coordenacao_' + $this.instanceId, $this.DOM).on('focus', function() {
			var coligada = $('#coligadaLotacaoModal_' + $this.instanceId).val();
			$this.zoomBuscaSecao($this.buildSecao(17), 6, "Coordenação", "coordenacao_" + $this.instanceId, coligada);
			$('#coordenacao_' + $this.instanceId, '#dialog-form_' + $this.instanceId).blur();
		});	
		$('#supervisao_' + $this.instanceId, $this.DOM).on('focus', function() {
			var coligada = $('#coligadaLotacaoModal_' + $this.instanceId).val();
			$this.zoomBuscaSecao($this.buildSecao(20), 7, "Supervisão", "supervisao_" + $this.instanceId, coligada);
			$('#supervisao_' + $this.instanceId, '#dialog-form_' + $this.instanceId).blur();
		});	
		$('#produto_' + $this.instanceId, $this.DOM).on('focus', function() {
			var coligada = $('#coligadaLotacaoModal_' + $this.instanceId).val();
			$this.zoomBuscaSecao($this.buildSecao(23), 8, "Produto", "produto_" + $this.instanceId, coligada);
			$('#produto_' + $this.instanceId, '#dialog-form_' + $this.instanceId).blur();
		});
	    //******FIM DO MODAL DE TRANSFERENCIA************		
	},
	
	existeChefeSecao: function(lotacao, coligada){
		var c1 = DatasetFactory.createConstraint("lotacao", lotacao, lotacao, ConstraintType.MUST);
		var c2 = DatasetFactory.createConstraint("codcoligada", coligada, coligada, ConstraintType.MUST);
		var c3 = DatasetFactory.createConstraint("chapa", "any", "any", ConstraintType.MUST);
		var constraints = [c1, c2, c3];
		
		var dataset = DatasetFactory.getDataset("dsMPChefeFuncionario", null, constraints, null);
		if (dataset.columns[0] == "erro"){
			return false;
		}
		
		if (dataset.values.length > 0){
			return true;
		}
		return false;		
	},
	
	buildSecao: function(limiter){
		var $this = this;
		var secao = "";
		 switch (limiter){
		    case 2:
		    	secao = $('#empresa_' + $this.instanceId, '#dialog-form_' + $this.instanceId).val();
		        break;
		    case 5:
		    	secao = $('#presidencia_' + $this.instanceId, '#dialog-form_' + $this.instanceId).val();
		    	break;
		    case 8:
		    	secao = $('#diretoriaEx_' + $this.instanceId, '#dialog-form_' + $this.instanceId).val();
		    	break;
		    case 11:
		    	secao = $('#diretoria_' + $this.instanceId, '#dialog-form_' + $this.instanceId).val();
		    	break;
		    case 14:
		    	secao = $('#matrizFilial_' + $this.instanceId, '#dialog-form_' + $this.instanceId).val();
		    	break;
		    case 17:
		    	secao = $('#gerencia_' + $this.instanceId, '#dialog-form_' + $this.instanceId).val();
		    	break;
		    case 20:
		    	secao = $('#coordenacao_' + $this.instanceId, '#dialog-form_' + $this.instanceId).val();
		    	break;
		    case 23:
		    	secao = $('#supervisao_' + $this.instanceId, '#dialog-form_' + $this.instanceId).val();
		    	break;
		    case 26:
		    	secao = $('#produto_' + $this.instanceId, '#dialog-form_' + $this.instanceId).val();
		    	break;
		    default:
		        break;
	    }
		return secao;		
	},
	
	
	//Zoom que busca coligada
	zoomBuscaColigada: function (type){
		var dataset="dsMPColigada"; 
		var campos = "codigo,Código,valor,Descrição";
		var titulo = "Coligada";
		var resultFields = "codigo,valor";
		var filtro = "";
		this.zoomFormulario(titulo, dataset, campos, resultFields, type, filtro);
	},
	
	//Zoom que busca seção por nível
	zoomBuscaSecao: function(secao, nivel, titulo, type, codcoligada){
		if (nivel > secao.length){
//			FLUIGC.toast({
//				title : 'Atenção',
//				message : 'Não há configuração para este campo no sistema.',
//				type : 'danger',
//				timeout : 2000
//			});
			return;
		}
//		var codsecao = -1; 
//		if (nivel != 0){
//			codsecao = secao.substring(0, nivel);
//		}
		var dataset = "dsiZoomHierarquia";
		var campos = "codigo,Código,valor,Descrição";
		var resultFields = "zoomColigada=" + codcoligada + ",zoomSecao=" + secao + ",zoomNivel=" + nivel + ",codigo, valor";
	    var filtro = "";
	    this.zoomFormulario(titulo, dataset, campos, resultFields, type, filtro);
	},
	
	zoomFormulario: function(titulo, dataset, campos, resultFields, type, filtro){
		var $this = this;
		$this.overideZoomItem($this);
		window.open("/webdesk/zoom.jsp?datasetId="+dataset+"&dataFields="+campos+
				"&resultFields="+resultFields+"&type="+type+"&title="+titulo+filtro, "zoom", "status , scrollbars=no ,width=800, height=350 , top=0 , left=0");		
	},

	getColigadaLotacaoPreenchida: function(){
		var $this = this;
		
		if ($('#coligadaLotacaoModal_' + $this.instanceId, "#dialog-form_" + $this.instanceId).val() != ""){
			return $('#coligadaLotacaoModal_' + $this.instanceId, "#dialog-form_" + $this.instanceId).val();
		}
		return "-";
	},
	
	getUltimaLotacaoPreenchida: function(){
		var $this = this;
		var campos = ["produto", "supervisao", "coordenacao", "gerencia", "matrizFilial",
		              "diretoria", "diretoriaEx", "presidencia", "empresa"];
		
		for (var i = 0; i < campos.length; i++){
			if ($('#' + campos[i] + '_' + $this.instanceId, "#dialog-form_" + $this.instanceId).val() != ""){
				return $('#' + campos[i] + '_' + $this.instanceId, "#dialog-form_" + $this.instanceId).val();
			}
		}
		return "-";
	},
	
	validateTableData: function(){
		var rows = this.table.getData();
		
		for (var i=0; i < rows.length; i++) {
			
			// Etapa: Deve ser numérico e maior que zero
			if (isNaN(rows[i].etapa) || rows[i].etapa <= 0){
				throw "Número de etapa inválido: " + rows[i].etapa;
			}
			
			// Etapa: Devem ser sequenciais (sem intervalos)
			if ( i+1 != rows[i].etapa ){
				throw "Etapa " + (i+1) + " não encontrada. Favor corrigir lista de aprovadores.";
			}
			
			// Tipo do Aprovador: campo obrigatório
			if (rows[i].codTipoAprovador < 0){
				throw "Campo <strong>Tipo do Aprovador</strong> não informado na etapa " + rows[i].etapa;
			}
			
			// Tipo do Aprovador: Verifica se o valor referente ao tipo do aprovador foi preenchido
			// Usuário Fluig
			if (rows[i].codTipoAprovador == 1 && this.isBlankOrNull(rows[i].codUsuarioFluig)){
				throw 'Campo <strong>Usuário FLUIG</strong> não informado na etapa ' + rows[i].etapa;
			}
			// Grupo Fluig
			if (rows[i].codTipoAprovador == 2 && this.isBlankOrNull(rows[i].codGrupoFluig)){
				throw "Campo <strong>Grupo FLUIG</strong> não informado na etapa " + rows[i].etapa;
			}
			// Lotação
			if (rows[i].codTipoAprovador == 3 && this.isBlankOrNull(rows[i].lotacao)){
				throw "Campo <strong>Seção</strong> não informado na etapa " + rows[i].etapa;
			}
			// Superior Imediato
			if (rows[i].codTipoAprovador == 4 && (this.isBlankOrNull(rows[i].codOrigemAprovador) || rows[i].codOrigemAprovador < 0 )){
				throw "Campo <strong>Origem Aprovador</strong> não informado na etapa " + rows[i].etapa;
			}
			// Nível Lotação
			if (rows[i].codTipoAprovador == 5 && this.isBlankOrNull(rows[i].nivelLotacao) ){
				throw "Campo <strong>Nível Seção</strong> não informado na etapa " + rows[i].etapa;
			}
			if (rows[i].codTipoAprovador == 5 && (this.isBlankOrNull(rows[i].codOrigemAprovador) || rows[i].codOrigemAprovador < 0 )){
				throw "Campo <strong>Origem Aprovador</strong> não informado na etapa " + rows[i].etapa;
			}
			// Gerente RH Site
			if (rows[i].codTipoAprovador == 6 && (this.isBlankOrNull(rows[i].codOrigemAprovador) || rows[i].codOrigemAprovador < 0 )){
				throw "Campo <strong>Origem Aprovador</strong> não informado na etapa " + rows[i].etapa;
			}
		}		
	},
	
	isBlankOrNull: function(value){
		if (value == null || value == "" || value == "-"){
			return true;
		}
		return false;
	},

	sortTable: function(){
		var rows = this.table.getData();
		rows.sort(function(a, b){return a.etapa - b.etapa;});
		this.table.reload(rows);
	},
	
	initHashTipoAprovador: function(){
		this.hTipoAprovador["-1"] = "-";
		this.hTipoAprovador["1"] = "Usuário Fluig";
		this.hTipoAprovador["2"] = "Grupo Fluig";
		this.hTipoAprovador["3"] = "Seção";
		this.hTipoAprovador["4"] = "Superior Imediato";
		this.hTipoAprovador["5"] = "Nível Seção";
		this.hTipoAprovador["6"] = "Gerente RH Site";
	},

	initHashOrigemAprovador: function(){
		this.hOrigemAprovador["-1"] = "-";
		this.hOrigemAprovador["1"] = "Requisitante";
		this.hOrigemAprovador["2"] = "Cedente";
		this.hOrigemAprovador["3"] = "Solicitante";
	},
	
	getUserNameById: function(idUser){
		if (idUser != null && idUser != "" && idUser != "-"){
			var c1 = DatasetFactory.createConstraint("colleaguePK.colleagueId", idUser, idUser, ConstraintType.MUST, false);
			var constraints = [c1];
			var fields = ['colleagueName'];
			
			var dataset = DatasetFactory.getDataset("colleague", fields, constraints, null);
			
			if (dataset.values.length > 0){
				return dataset.values[0]['colleagueName'];
			}
		}
		return "-";
	},
	
	getGroupNameById: function(idGroup){
		if (idGroup != null && idGroup != "" && idGroup != "-"){ 
			var c1 = DatasetFactory.createConstraint("groupPK.groupId", idGroup, idGroup, ConstraintType.MUST, false);
			var constraints = [c1];
			var fields = ['groupDescription'];
			
			var dataset = DatasetFactory.getDataset("group", fields, constraints, null);
			
			if (dataset.values.length > 0){
				return dataset.values[0]['groupDescription'];
			}
		}
		return "-";
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
	
	overideZoomItem : function(that){
		var $this = this;
        var newSelectedItem = function(selectedItem){
        	var type = selectedItem['type'];
        	var arrayType = type.split("_");
        	
        	var contextoLotacao = "#dialog-form_" + arrayType[1];
        	
        	if (arrayType.length > 1){
        		
        		if (arrayType[0] == 'lstUsuarios'){
        			$('#codUsuarioFluig_' + arrayType[1], that.DOM).val( selectedItem['colleaguePK.colleagueId'] );
        			$('#usuarioFluig_' + arrayType[1], that.DOM).val( selectedItem['colleagueName'] );
        		
        		} else if(arrayType[0] == 'lstGrupos'){
        			$('#codGrupoFluig_' + arrayType[1], that.DOM).val( selectedItem['groupPK.groupId'] );
        			$('#grupoFluig_' + arrayType[1], that.DOM).val( selectedItem['groupDescription'] );		
        		} else if(arrayType[0] == 'coligadaProposta'){
        			$('#coligadaLotacaoModal_' + arrayType[1]).val( selectedItem['codigo'] );
        			$('#descColigadaLotacaoModal_' + arrayType[1]).val( selectedItem['valor'] );		
        			var campos = ["empresa", "presidencia","diretoriaEx", "diretoria", "matrizFilial", "gerencia",
        			              "coordenacao", "supervisao", "produto"];
        			$this.cleanAndLockFields(campos, arrayType[1], contextoLotacao);
        			$('#empresa_' + arrayType[1], contextoLotacao).removeAttr('readonly');
        			
        		} else if (arrayType[0] == "empresa"){
        			$('#empresa_' + arrayType[1], contextoLotacao).val(selectedItem["codigo"]);
        			$('#descEmpresa_' + arrayType[1], contextoLotacao).val(selectedItem["valor"]);
        			var campos = ["presidencia","diretoriaEx", "diretoria", "matrizFilial", "gerencia",
        			              "coordenacao", "supervisao", "produto"];
        			$this.cleanAndLockFields(campos, arrayType[1], contextoLotacao);
        			$('#presidencia_' + arrayType[1], contextoLotacao).removeAttr('readonly');
        		
        		} else if (arrayType[0] == "presidencia"){
        			$('#presidencia_' + arrayType[1], contextoLotacao).val(selectedItem["codigo"]);
        			$('#descPresidencia_' + arrayType[1], contextoLotacao).val(selectedItem["valor"]);
        			var campos = ["diretoriaEx","diretoria", "matrizFilial", "gerencia", "coordenacao",
        			              "supervisao", "produto"];
        			$this.cleanAndLockFields(campos, arrayType[1], contextoLotacao);
        			$('#diretoriaEx_' + arrayType[1], contextoLotacao).removeAttr('readonly');
        		
        		} else if (arrayType[0] == "diretoriaEx"){
        			$('#diretoriaEx_' + arrayType[1], contextoLotacao).val(selectedItem["codigo"]);
        			$('#descDiretoriaEx_' + arrayType[1], contextoLotacao).val(selectedItem["valor"]);
        			var campos = ["diretoria", "matrizFilial", "gerencia", "coordenacao", "supervisao",
        			              "produto"];
        			$this.cleanAndLockFields(campos, arrayType[1], contextoLotacao);
        			$('#diretoria_' + arrayType[1], contextoLotacao).removeAttr('readonly');
        		
        		} else if (arrayType[0] == "diretoria"){
        			$('#diretoria_' + arrayType[1], contextoLotacao).val(selectedItem["codigo"]);
        			$('#descDiretoria_' + arrayType[1], contextoLotacao).val(selectedItem["valor"]);
        			var campos = ["matrizFilial", "gerencia", "coordenacao", "supervisao", "produto"];
        			$this.cleanAndLockFields(campos, arrayType[1], contextoLotacao);
        			$('#matrizFilial_' + arrayType[1], contextoLotacao).removeAttr('readonly');
        		
        		} else if (arrayType[0] == "matrizFilial"){
        			$('#matrizFilial_' + arrayType[1], contextoLotacao).val(selectedItem["codigo"]);
        			$('#descMatrizFilial_' + arrayType[1], contextoLotacao).val(selectedItem["valor"]);
        			var campos = ["gerencia", "coordenacao", "supervisao", "produto"];
        			$this.cleanAndLockFields(campos, arrayType[1], contextoLotacao);
        			$('#gerencia_' + arrayType[1], contextoLotacao).removeAttr('readonly');
        		
        		} else if (arrayType[0] == "gerencia"){
        			$('#gerencia_' + arrayType[1], contextoLotacao).val(selectedItem["codigo"]);
        			$('#descGerencia_' + arrayType[1], contextoLotacao).val(selectedItem["valor"]);
        			var campos = ["coordenacao", "supervisao", "produto"];
        			$this.cleanAndLockFields(campos, arrayType[1], contextoLotacao);
        			$('#coordenacao_' + arrayType[1], contextoLotacao).removeAttr('readonly');
        		
        		} else if (arrayType[0] == "coordenacao"){
        			$('#coordenacao_' + arrayType[1], contextoLotacao).val(selectedItem["codigo"]);
        			$('#descCoordenacao_' + arrayType[1], contextoLotacao).val(selectedItem["valor"]);
        			var campos = ["supervisao", "produto"];
        			$this.cleanAndLockFields(campos, arrayType[1], contextoLotacao);
        			$('#supervisao_' + arrayType[1], contextoLotacao).removeAttr('readonly');
        		
        		} else if (arrayType[0] == "supervisao"){
        			$('#supervisao_' + arrayType[1], contextoLotacao).val(selectedItem["codigo"]);
        			$('#descSupervisao_' + arrayType[1], contextoLotacao).val(selectedItem["valor"]);
        			var campos = ["produto"];
        			$this.cleanAndLockFields(campos, arrayType[1], contextoLotacao);
        			$('#produto_' + arrayType[1], contextoLotacao).removeAttr('readonly');
        		
        		} else if (arrayType[0] == "produto"){
        			$('#produto_' + arrayType[1], contextoLotacao).val(selectedItem["codigo"]);
        			$('#descProduto_' + arrayType[1], contextoLotacao).val(selectedItem["valor"]);
        		}
        	}
        };
        setSelectedZoomItem = newSelectedItem;
    },
    
    cleanAndLockFields: function(listaCampos, instanceId, contexto){
		if (listaCampos == null){
			return;
		}
		var i;
		for (i = 0; i < listaCampos.length; i++){
			$('#'+listaCampos[i] + '_' + instanceId, contexto).attr('readonly', '');
			$('#'+listaCampos[i] + '_' + instanceId, contexto).val('');
			var firstLetter = listaCampos[i].substring(0,1);
			$('#desc'+firstLetter.toUpperCase()+listaCampos[i].substring(1,listaCampos[i].length) + '_' + instanceId, contexto).val('');
		}
		$('#coligadaLotacaoModal_' + instanceId, contexto).removeAttr('readonly');
	}    
	
});

function setSelectedZoomItem(selectedItem){}