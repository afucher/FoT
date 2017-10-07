<div class="fluig-style-guide wcm-widget-class super-widget"
     id="widgetAcoes_${instanceId}"
     data-params="widgetAcoes.instance({instanceId: '${instanceId!''}',widgetURI: '${widgetURI!''}',mode: '${mode!''}'})">

	<div class="panel panel-default">
		<div class="panel-heading">
			<h3 class="panel-title">Configura&ccedil;&atilde;o de A&ccedil;&otilde;es</h3>
		</div>

		<div class="panel-body">
			
				<div class="container-fluid col-xs-12 col-sm-12 col-md-12 col-lg-12">
					<form role="form">
					
						<div class="panel panel-default">
							<div class="panel-body">
								<div class="row">

					            	<div class="form-group col-sm-5">
					            		<label for="nome_${instanceId}">Nome</label>		
										<input type="text" name="nome_${instanceId}" id="nome" class="form-control" placeholder="Nome" autofocus />
					            	</div>

				            	</div>

		            		</div>
		            	</div>

						<div class="row fs-md-space fs-no-padding-left fs-no-padding-bottom">
							<div class="form-group fs-float-right">
				            	<button id="btnSave_${instanceId}" class="btn btn-success" data-aprovador-save>Salvar</button>
				            </div>
			            </div>

						<div class="row" style="z-index:-1;">						
							<div class="col-sm-12 table-responsive" id="tbAprovadores_${instanceId}"></div>
						</div>
												
					</form>
				</div>
		</div>
	</div>
</div>

<script src="/webdesk/vcXMLRPC.js" type="text/javascript"></script>