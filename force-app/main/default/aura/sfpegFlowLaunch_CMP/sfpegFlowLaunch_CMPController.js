({
    buttonClick : function (component, event, helper) {
        console.log('buttonClick: START');
        helper.launchFlow(component, event, helper); 
        console.log('buttonClick: flow container display requested');
        setTimeout(() => {
            console.log('buttonClick: launching flow');
            helper.executeFlow(component, event, helper);
            console.log('buttonClick: END / flow launched');
        },100); 
    },
    closeClick : function (component, event, helper) {
        console.log('closeClick: START');
        helper.stopFlow(component, event, helper);
        console.log('closeClick: END');
    },
    statusChange : function (component, event, helper) {
        console.log('statusChange: START');
        if (event.getParam('status') === "FINISHED") {
            console.log('statusChange: finished status');
            helper.stopFlow(component, event, helper);    
        }
        else {
            console.log('statusChange: other status',JSON.stringify(event.getParams()));
        }
        console.log('statusChange: END');
    }
})
