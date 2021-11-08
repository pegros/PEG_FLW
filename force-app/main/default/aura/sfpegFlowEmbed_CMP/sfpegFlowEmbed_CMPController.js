({
	doInit : function(component, event, helper) {
        console.log('doInit: START');
		helper.initComponent(component, event, helper);        
        console.log('doInit: END');
	},
    statusChange : function (component, event, helper) {
        console.log('statusChange: START');
    	if (event.getParam('status') === "FINISHED") {
        	console.log('statusChange: finished status');
			helper.navigate2target(component, event, helper);    
    	}
        else {
        	console.log('statusChange: other status',JSON.stringify(event.getParams()));
        }
        console.log('statusChange: END');
    }
})