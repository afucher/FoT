function displayFields(form,customHTML){ 
	
	var FORM_MODE = form.getFormMode();
	
	if (FORM_MODE == "VIEW"){
		form.setShowDisabledFields(true);
	}
	
}