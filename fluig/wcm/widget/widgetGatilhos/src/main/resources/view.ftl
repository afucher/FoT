<div id="widgetGatilhos_${instanceId}" 
	class="super-widget wcm-widget-class fluig-style-guide" 
	data-params="widgetGatilhos.instance({instanceId: '${instanceId!''}',widgetURI: '${widgetURI!''}',mode: '${mode!''}'})">
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
			    <div class="form-group">
			        <label for="categoria">Categoria</label>
			        <select class="form-control" id="categoria_${instanceId}">
					    <option value="sensores">Sensores</option>
					    <option value="workflows">Workflows</option>
					    <option value="documentos">Documentos</option>
					</select>
			    </div>
			    <div class="form-group">
			        <label for="tipo">Tipo</label>
			        <select class="form-control" id="tipo_${instanceId}">
					    <option>Sensores</option>
					    <option>Workflows</option>
					    <option>Documentos</option>
					</select>
			    </div>
			    <button type="submit" class="btn btn-default">Incluir</button>
			</form>
	    </div>
	</div>
</div>

