({
    launchFlow : function(component, event, helper) {
        console.log('launchFlow: START');
        let flowName = component.get("v.flowName");
        console.log('launchFlow: flow name fetched ',flowName);

        if (flowName) {
            component.set("v.isFlowRunning",true);
            console.log('launchFlow: END / launching flow');
        }
        else {
            console.warn('launchFlow:END KO /  missing flow name');
        }
    },
    executeFlow : function(component, event, helper) {
        console.log('executeFlow: START');

        let flowName = component.get("v.flowName");
        console.log('executeFlow: flow name fetched ',flowName);

        let inputVar = [];
        if (component.get("v.useRecordId")) {
            let recordId = component.get("v.recordId");
            console.log('executeFlow: recordId fetched ',recordId);
            if (recordId) inputVar.push({name: "recordId",type: "String",value: recordId});
        }
        if (component.get("v.useSObjectName")) {
            let recordId = component.get("v.sObjectName");
            console.log('executeFlow: sObjectName fetched ',sObjectName);
            if (recordId) inputVar.push({name: "sObjectName",type: "String",value: sObjectName});
        }
        console.log('initComponent: flow inputs initialized ', inputVar);

        let flowContainer = component.find("flowContainer");
        console.log('executeFlow: flow container fetched ',flowContainer);

        if (flowContainer) flowContainer.startFlow(flowName, inputVar);

        console.log('executeFlow: END');
    },
    stopFlow : function(component, event, helper) {
        console.log('stopFlow: START');
        component.set("v.isFlowRunning",false);

        if (component.get("v.doRefresh")) {
            console.log('stopFlow: triggering view refresh');
            $A.get('e.force:refreshView').fire();
        }
        console.log('stopFlow: END');
    }
})
