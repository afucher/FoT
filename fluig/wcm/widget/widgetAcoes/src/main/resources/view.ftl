<div class="fluig-style-guide wcm-widget-class super-widget" id="widgetAcoes_${instanceId}"
	data-params="widgetAcoes.instance({instanceId: '${instanceId!''}',widgetURI: '${widgetURI!''}',mode: '${mode!''}'})">
	<div class="panel panel-primary">
	    <div class="panel-heading">
	        <h3 class="panel-title">Cadastro de Ações</h3>
	    </div>
	    <div class="panel-body">
	        <form role="form" onSubmit="data-aprovador-add">
			    <div class="form-group">
			        <label for="nome">Nome</label>
			        <input type="text" class="form-control" id="nome_${instanceId}" placeholder="Digite o nome da ação" required>
			    </div>
			    <div class="row">
			    	<div class="col-sm-6">
			    		<div class="form-group">
					        <label for="categoria">Categoria</label>
					        <select class="form-control" id="categoria_${instanceId}" required>
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
					        <select class="form-control" id="tipo_${instanceId}" required>
							    					    
							</select>
					    </div>			    	
			    	</div>
			    </div>
			    
			    <button type="submit" class="btn btn-default" data-acao-add>Incluir</button>
			    <script>
			    	$("#categoria_${instanceId}").change(function() {
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
						var $tipo = $("#tipo_${instanceId}");
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

<script src="/webdesk/vcXMLRPC.js" type="text/javascript"></script>