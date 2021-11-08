({
	doInit : function(component, event, helper) {
        console.log('doInit: START with recordId ', component.get('v.recordId'));
        helper.processInit(component);
        console.log('doInit: END');	
	},
    handleLoad: function(component, event, helper) {
        console.log('handleLoad: START with recordId ', component.get('v.recordId'));
        let changeType = event.getParam('changeType');
        if (changeType == 'LOADED') {
            console.log("handleLoad: processing load event");
        	helper.processLoad(component);
        }
        else if (changeType == 'CHANGED') {
            console.log("handleLoad: processing change event");
            helper.processLoad(component);
        }
        else {
            console.log("handleLoad: event ignored ",changeType);
        }
        console.log('handleLoad: END');	
	}
})