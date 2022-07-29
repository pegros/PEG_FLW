({
    doInit : function(component, event, helper) {
        helper.SHOW_DEBUG = component.get("v.isDebug");
        if (helper.SHOW_DEBUG)  console.log('doInit: START');
        helper.processInit(component,helper);
        if (helper.SHOW_DEBUG)  console.log('doInit: END');	
    },
    handleTabOpen: function(component, event, helper) {
        if (helper.SHOW_DEBUG)  console.log('handleTabOpen: START');
        helper.processTabOpen(component,event,helper);
        if (helper.SHOW_DEBUG)  console.log('handleTabOpen: END');
    },
    handleTabFocus : function(component, event, helper) {
        if (helper.SHOW_DEBUG)  console.log('handleTabFocus: START');
        if (helper.SHOW_DEBUG)  console.log('handleTabFocus: event params ', JSON.stringify(event.getParams()));
        helper.processTabFocus(component,event,helper);
        if (helper.SHOW_DEBUG)  console.log('handleTabFocus: END');	
    },
    handleTabCreate : function(component, event, helper) {
        if (helper.SHOW_DEBUG)  console.log('handleTabCreate: START');
        if (helper.SHOW_DEBUG)  console.log('handleTabCreate: event params ', JSON.stringify(event.getParams()));
        if (helper.SHOW_DEBUG)  console.log('handleTabCreate: END');	
    }
})