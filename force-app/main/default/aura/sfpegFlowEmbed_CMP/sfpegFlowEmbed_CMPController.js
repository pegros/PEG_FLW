({
    doInit : function(component, event, helper) {
        //console.log('doInit: START');
        helper.initComponent(component, event, helper);        
        //console.log('doInit: END');
    },
    statusChange : function (component, event, helper) {
        if (helper.SHOW_DEBUG) console.log('statusChange: START');
        if (event.getParam('status') === "FINISHED") {
            if (helper.SHOW_DEBUG) console.log('statusChange: finished status');
            helper.navigate2target(component, event, helper);    
        }
        else {
            if (helper.SHOW_DEBUG) console.log('statusChange: other status',JSON.stringify(event.getParams()));
        }
        if (helper.SHOW_DEBUG) console.log('statusChange: END');
    }
})