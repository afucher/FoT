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

<script src="/webdesk/vcXMLRPC.js" type="text/javascript"></script>

