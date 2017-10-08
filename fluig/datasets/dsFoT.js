function defineStructure() {

}

function onSync(lastSyncDate) {

}

function createDataset(fields, constraints, sortFields) {
	var dataset = DatasetBuilder.newDataset();
    
	var tempDataset = getDefaultValues();
	
    dataset.addColumn("SensorID");
    dataset.addColumn("Behavior");
    dataset.addColumn("Value");
    
    if(constraints!=null && constraints.length > 0){

        for(var a=0;a < tempDataset.length;a++){
            if(constraints[0].initialValue==tempDataset[a][constraints[0].fieldName]){
                dataset.addRow(new Array(tempDataset[a]["SensorID"], tempDataset[a]["Behavior"],tempDataset[a]["Value"]));
            }
        }
    
    } else {
    	for(var a=0;a < tempDataset.length;a++){
    		dataset.addRow(new Array(tempDataset[a]["SensorID"], tempDataset[a]["Behavior"],tempDataset[a]["Value"]));
    	}
    }
    
    return dataset;
}

function onMobileSync(user) {

}

function getDefaultValues(){
return  [{
			SensorID: "0001",
			Behavior: "<",
			Value: "15"
        },
        {
        	SensorID: "0002",
        	Behavior: "<=",
        	Value: "10"
        },
        {
        	SensorID: "0003",
        	Behavior: ">=",
        	Value: "25"
        },
        {
        	SensorID: "0004",
        	Behavior: ">",
        	Value: "100"
        },
        {
        	SensorID: "0005",
        	Behavior: "=",
        	Value: "50"
        }];
}