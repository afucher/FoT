<div id="widgetFoT_${instanceId}" class="super-widget wcm-widget-class fluig-style-guide"
	data-params="widgetFoT.instance({instanceId: '${instanceId!''}',widgetURI: '${widgetURI!''}',mode: '${mode!''}'})">

	<div class="row">
	
		<div class="col-sm-3 fs-txt-center">
			<img src="/widgetFoT/resources/images/fot.png" height="200" width="200">
		</div>

		<div class="col-sm-9">
			<div class="panel panel-primary">
				<div class="panel-heading">
					<h3 class="panel-title">Cadastro de Gatilhos</h3>
				</div>
				<div class="panel-body">
					<form role="form">
					
						<div class="row">
								<div class="col-sm-2">
									<div class="form-group">
										<label for="id">ID</label>
										<input type="text" class="form-control" id="idGatilho_${instanceId}"
											placeholder="ID" required>
									</div>
								</div>
								<div class="col-sm-4">
									<div class="form-group">
										<label for="nome">Nome</label>
										<input type="text" class="form-control" id="nome_${instanceId}"
											placeholder="Nome" required>
									</div>
								</div>
								
								<div class="col-sm-3">
									<div class="form-group">
										<label for="comportamento">Comportamento</label>
										<select class="form-control" id="comportamento_${instanceId}"
											required>
											<option></option>
											<option value="maiorIgual">Maior igual</option>
											<option value="menorIgual">Menor igual</option>
											<option value="maior">Maior</option>
											<option value="menor">Menor</option>
											<option value="igual">Igual</option>
										</select>
									</div>
								</div>
								
								<div class="col-sm-3 form-group">
									<label for="valor">Valor</label>
									<input type="number" class="form-control" id="valor_${instanceId}"
										placeholder="Valor" required>
								</div>														
								
							</div>
	
							<div class="row">
								<div class="col-sm-6">
									<div class="form-group">
										<label for="workflow">Workflow</label>
										<select class="form-control" id="workflow_${instanceId}"
											required>
											<option></option>
										</select>
									</div>							
								</div>									
							
								<div class="col-sm-3">
									<div class="form-group">
										<label for="ocorrencia">Ocorrencias</label>
										<input type="number" class="form-control" pattern="[0-9]+$"
											value="1" min="1" step="1" id="ocorrencia_${instanceId}"
											placeholder="Ocorrências" required>
									</div>
								</div>
								<div class="col-sm-3">
									<div class="form-group">
										<label for="intervalo">Intervalo</label>
										<input type="number" class="form-control" pattern="[0-9]+$"
											value="1" min="1" step="1" id="intervalo_${instanceId}"
											placeholder="Intervalo" required>
									</div>
								</div>
							</div>
	
							<button type="button" class="btn btn-default"
								data-gatilho-add>Incluir</button>								
							
						
					
					</form>
				</div>
			</div>
		</div>
	</div>
	
	<div class="row" style="z-index:-1;">						
		<div class="col-sm-12 table-responsive" id="tbGatilhos_${instanceId}"></div>
	</div>		
</div>

<script src="/webdesk/vcXMLRPC.js" type="text/javascript"></script>

