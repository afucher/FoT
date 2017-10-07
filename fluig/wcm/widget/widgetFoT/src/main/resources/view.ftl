<style>
	.fot-panels {
	    display: flex;
	    width: 100%;
	}
	
	.fot-panel {
	    padding: 10px;
	    text-align: center;
	    
	}
	
	.fot-panel.left {
	    flex-grow: 10;
	}
	
	.fot-panel.middle {
	    max-width: 80px;
	    display: flex;
	    align-items: center;
	}
	
	.fot-panel.right {
	    flex-grow: 10;
	}
</style>
<div id="widgetFoT_${instanceId}" class="super-widget wcm-widget-class fluig-style-guide"
	data-params="widgetFoT.instance({instanceId: '${instanceId!''}',widgetURI: '${widgetURI!''}',mode: '${mode!''}'})">
	<div class="panel panel-primary">
	    <div class="panel-heading">
	        <h3 class="panel-title">Fluig of Things</h3>
	    </div>
	    <div class="panel-body">
	    	<div class="fot-panels">
		    	<div class="fot-panel left">
		    		<div class="form-group">
				        <label for="gatilho">Gatilho</label>
				        <select class="form-control" id="gatilho_${instanceId}" name="gatilho_${instanceId}">
				        	<option></option>
						</select>
				    </div>
		    	</div>
		    	<div class="fot-panel middle">
		    		<span class="fluigicon fluigicon-arrow-right fluigicon-xl"></span>
		    	</div>
		    	<div class="fot-panel right">
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

