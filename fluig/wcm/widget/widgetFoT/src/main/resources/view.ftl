<style>
	.fot-input {
		display: flex;
		align-items: center;
	}
	
	.va.center {
		display: flex;
		justify-content: center;
		
	}
</style>
<div id="widgetFoT_${instanceId}" class="super-widget wcm-widget-class fluig-style-guide"
	data-params="widgetFoT.instance({instanceId: '${instanceId!''}',widgetURI: '${widgetURI!''}',mode: '${mode!''}'})">
	
	<div class="row">
		<div class="col-sm-12">
			<div class="panel panel-primary">
			    <div class="panel-heading">
			        <h3 class="panel-title">Fluig of Things</h3>
			    </div>
			    <div class="panel-body">
			    	<div class="row fot-input">
			    		<div class="col-sm-5">
			    			<div class="form-group">
						        <label for="gatilho">Gatilho</label>
						        <select class="form-control" id="gatilho_${instanceId}" name="gatilho_${instanceId}">
						        	<option></option>
								</select>
						    </div>
			    		</div>
			    		<div class="col-sm-2 va-center" align="center">
			    			<span class="fluigicon fluigicon-arrow-right fluigicon-xl"></span>
			    		</div>
			    		<div class="col-sm-5">
			    			<div class="form-group">
						        <label for="acao">A&ccedil;&atilde;o</label>
						        <select class="form-control" id="acao_${instanceId}" name="acao_${instanceId}">
						        	<option></option>
								</select>
						    </div>
			    		</div>
			    	</div>
				    <div align="center">
				    	<button type="button" class="btn btn-primary" data-fot-add>Incluir</button>
				    </div>
			    </div>
		    </div>
		</div>
	</div>
	
	<div class="row">
	
	<div class="col-sm-6">
		<div class="panel panel-primary">
		    <div class="panel-heading">
		        <h3 class="panel-title">Cadastro de Gatilhos</h3>
		    </div>
		    <div class="panel-body">
		        <form role="form">
				    <div class="form-group">
				        <label for="nome">Nome</label>
				        <input type="text" class="form-control" id="nome_${instanceId}" placeholder="Digite o nome do gatilho">
				    </div>
				    <div class="row">
				    	<div class="col-sm-6">
					    	<div class="form-group">
						        <label for="categoria">Categoria</label>
						        <select class="form-control" id="categoria_${instanceId}" name="categoria_${instanceId}">
						        	<option></option>
								    <option value="sensores">Sensores</option>
								    <option value="workflows">Workflows</option>
								    <option value="documentos">Documentos</option>
								</select>
						    </div>
				    	</div>
				    	<div class="col-sm-6">
					    	<div class="form-group">
						        <label for="tipo">Tipo</label>
						        <select class="form-control" id="tipo_${instanceId}">
								</select>
						    </div>
				    	</div>
				    </div>
				    
				    <button type="button" class="btn btn-default" data-gatilho-add>Incluir</button>
				</form>
		    </div>
		</div>
	</div>
	
	<div class="col-sm-6">
		<div class="panel panel-primary">
		    <div class="panel-heading">
		        <h3 class="panel-title">Cadastro de Ações</h3>
		    </div>
		    <div class="panel-body">
		        <form role="form" onSubmit="data-aprovador-add">
				    <div class="form-group">
				        <label for="nome">Nome</label>
				        <input type="text" class="form-control" id="nomeAc_${instanceId}" placeholder="Digite o nome da ação" required>
				    </div>
				    <div class="row">
				    	<div class="col-sm-6">
				    		<div class="form-group">
						        <label for="categoria">Categoria</label>
						        <select class="form-control" id="categoriaAc_${instanceId}" required>
						        	<option></option>
								    <option value="sensores">Atuador</option>
								    <option value="workflow">Workflow</option>
								    <option value="documento">Documento</option>
								</select>
						    </div>
				    	</div>
				    	<div class="col-sm-6">
							<div class="form-group">
						        <label for="tipo">Tipo</label>
						        <select class="form-control" id="tipoAc_${instanceId}" required>
								    					    
								</select>
						    </div>			    	
				    	</div>
				    </div>
				    
				    <button type="button" class="btn btn-default" data-acao-add>Incluir</button>
				    <script>
				    	$("#categoriaAc_${instanceId}").change(function() {
							var $cat = $(this);
							var key = $cat.val();
							var vals = [];
							switch(key) {
								case 'sensores':
									vals = ['Ligar', 'Desligar'];
									break;
								case 'workflow':
									vals = ['Iniciar', 'Movimentar'];
									break;
								case 'documento':
									vals = ['Criar', 'Aprovar'];
							}
							var $tipo = $("#tipoAc_${instanceId}");
							$tipo.empty();
							$.each(vals, function(index, value) {
								$tipo.append("<option>" + value + "</option>");
							});
						});
				    </script>
				</form>
		    </div>
		</div>
	</div>
	
	</div>
</div>

<script src="/webdesk/vcXMLRPC.js" type="text/javascript"></script>

