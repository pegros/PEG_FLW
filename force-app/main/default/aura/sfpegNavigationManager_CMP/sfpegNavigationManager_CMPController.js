({
	doInit : function(component, event, helper) {
        console.log('doInit: START');
        helper.processInit(component);
        console.log('doInit: END');	
	},
    handleTabOpen: function(component, event, helper) {
        console.log('handleTabOpen: START');
        helper.processTabOpen(component,event,helper);
        console.log('handleTabOpen: END');
    },
    handleTabFocus : function(component, event, helper) {
        console.log('handleTabFocus: START');
        console.log('handleTabFocus: event params ', JSON.stringify(event.getParams()));
        helper.processTabFocus(component,event,helper);
        console.log('handleTabFocus: END');	
	},
    handleTabCreate : function(component, event, helper) {
        console.log('handleTabCreate: START');
        console.log('handleTabCreate: event params ', JSON.stringify(event.getParams()));
        console.log('handleTabCreate: END');	
	}
})