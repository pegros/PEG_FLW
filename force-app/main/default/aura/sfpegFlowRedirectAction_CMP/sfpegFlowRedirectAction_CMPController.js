({
    invoke : function(component, event, helper) {
        console.log('invoke: START');
        let targetId = component.get("v.targetId");
        console.log('invoke: targetId fetched',targetId);

        let isPreview = component.get("v.isPreview");
        console.log('invoke: isPreview fetched',isPreview);

        /*let redirectAction;
        if (isPreview) {
            console.log('invoke: setting preview action');
            redirectAction = $A.get("e.lightning:openFiles");
            redirectAction.setParams({ recordIds: [targetId] });
        }
        else {
            console.log('invoke: setting navigation action');
            redirectAction = $A.get("e.force:navigateToSObject");
            redirectAction.setParams({ recordId: targetId });
        }

        console.log('invoke: triggering redirection');
        redirectAction.fire();
        console.log('invoke: END / redirection fired');*/

        let navService = component.find('navService');
        let pageReference;
        if (isPreview) {
            console.log('invoke: setting preview action');
            pageReference =  {
                type: 'standard__namedPage',
                attributes: { pageName: 'filePreview' },
                state : {
                    recordIds: targetId,
                    selectedRecordId: targetId
                }
            }
        }
        else {
            console.log('invoke: setting navigation action');
            pageReference =  {
                type: 'standard__recordPage',
                attributes: {
                    recordId: targetId,
                    actionName: 'view'
                }
            }
        }
        console.log('invoke: triggering navigation');
        navService.navigate(pageReference);
        console.log('invoke: navigation triggered');
    }
})