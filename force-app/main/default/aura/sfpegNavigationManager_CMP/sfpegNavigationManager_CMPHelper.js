({
    //TABS_TO_CLOSE : {},
    TABS_TO_FOCUS : {},
    SHOW_DEBUG : false,
    processInit : function(component,helper) {
        if (helper.SHOW_DEBUG) console.log('processInit: START');
        let wkspUtil = component.find("wkspUtil");
        wkspUtil.isConsoleNavigation()
        .then(consoleMode => {
            component.set("v.isConsole",consoleMode);
            if (helper.SHOW_DEBUG) console.log('processInit: END / console mode set ',consoleMode);
        }).catch(error => {
            console.error('processInit: END / isConsoleNavigation error ',JSON.stringify(error));  
        });         
        if (helper.SHOW_DEBUG) console.log('processInit: temporary end');	
    },
    processTabOpen: function(component, event, helper) {
        if (helper.SHOW_DEBUG) console.log('processTabOpen: START');

        let isConsole = component.get("v.isConsole");
        if (helper.SHOW_DEBUG) console.log('processTabOpen: isConsole fetched ',isConsole);
        let sourceId = event.getParam('sourceId');
        if (helper.SHOW_DEBUG) console.log('processTabOpen: sourceId extracted ',sourceId);
        let targetId = event.getParam('targetId');
        if (helper.SHOW_DEBUG) console.log('processTabOpen: targetId extracted ',targetId);
        let targetPage = event.getParam('targetPage');
        if (helper.SHOW_DEBUG) console.log('processTabOpen: targetPage extracted ',JSON.stringify(targetPage));

        if (isConsole) {
            // ### CONSOLE MODE ###
            if (helper.SHOW_DEBUG) console.log('processTabOpen: operating in console mode');

            let wkspUtil = component.find("wkspUtil");
            let openParams = (targetId ? {recordId: targetId} : {pageReference : targetPage});
            openParams.focus= true;
            openParams.overrideNavRules= false;
            if (helper.SHOW_DEBUG) console.log('processTabOpen: openParams prepared',JSON.stringify(openParams));

            wkspUtil.openTab(openParams)
            .then(function(newTabId){
                if (helper.SHOW_DEBUG) console.log('processTabOpen: new tab opened ',newTabId);
                helper.TABS_TO_FOCUS[newTabId] = Date.now();
                if (helper.SHOW_DEBUG) console.log('processTabOpen: TABS_TO_FOCUS updated ',JSON.stringify(helper.TABS_TO_FOCUS));
                if (sourceId) {
                    if (helper.SHOW_DEBUG) console.log('processTabOpen: closing old tab ',sourceId);
                    wkspUtil.closeTab({tabId: sourceId})
                    .then(function(status){
                        if (helper.SHOW_DEBUG) console.log('processTabOpen: END / previous tab closed ',status);
                    }).catch(function(error){
                        console.error('processTabOpen: END / closeTab error ',JSON.stringify(error));  
                    });
                }
                else {
                    if (helper.SHOW_DEBUG) console.log('processTabOpen: END / no old tab to close ');
                }
            }).catch(function(error){
                if (helper.SHOW_DEBUG) console.error('processTabOpen: END / openTab error ',JSON.stringify(error));  
            });
            if (helper.SHOW_DEBUG) console.log('processTabOpen: topening target tab');
        }
        else {
            // ### STANDARD MODE ###
            if (helper.SHOW_DEBUG) console.log('processTabOpen: operating in standard mode');
            let navService = component.find("navUtil");
            let pageRef = (targetId ? {"type": "standard__recordPage",
                                       "attributes": {"recordId": targetId,"actionName": "view" }}
                                    : targetPage);
            if (helper.SHOW_DEBUG) console.log('processTabOpen: target pageRef prepared ', JSON.stringify(pageRef));
            navService.navigate(pageRef);
            if (helper.SHOW_DEBUG) console.log('processTabOpen: END');
        }
    },
    processTabFocus : function(component, event, helper) {
        if (helper.SHOW_DEBUG) console.log('processTabFocus: START');
        if (helper.SHOW_DEBUG) console.log('processTabFocus: event params ', JSON.stringify(event.getParams()));
        let previousTabId = event.getParam('previousTabId');
        if (helper.SHOW_DEBUG) console.log('processTabFocus: previousTabId extracted ',previousTabId);
        
        //console.log('processTabFocus: TABS_TO_CLOSE fetched ',JSON.stringify(helper.TABS_TO_CLOSE));
        if (helper.SHOW_DEBUG) console.log('processTabFocus: TABS_TO_FOCUS fetched ',JSON.stringify(helper.TABS_TO_FOCUS));
        
        if (helper.TABS_TO_FOCUS[previousTabId]) {
            if (helper.SHOW_DEBUG) console.log('processTabFocus: previousTab TS ', helper.TABS_TO_FOCUS[previousTabId]);
            let currentTS = Date.now();
            if (helper.SHOW_DEBUG) console.log('processTabFocus: current TS ', currentTS);

            // WARNING - Setting threshold to 1000 ms to handle automatic new tab refocus after close
            if (currentTS - helper.TABS_TO_FOCUS[previousTabId] > 1000) {
                if (helper.SHOW_DEBUG) console.log('processTabFocus: END / ignoring user tab selection');
                delete helper.TABS_TO_FOCUS[previousTabId];
            }
            else {
                if (helper.SHOW_DEBUG) console.log('processTabFocus: previousTabId to refocus');
                delete helper.TABS_TO_FOCUS[previousTabId];
                if (helper.SHOW_DEBUG) console.log('processTabFocus: TABS_TO_FOCUS updated ',JSON.stringify(helper.TABS_TO_FOCUS));
                let wkspUtil = component.find("wkspUtil");
                //console.log('processInit: wkspUtil fetched',wkspUtil);
                wkspUtil.focusTab({tabId: previousTabId})
                .then(function(status){
                    if (helper.SHOW_DEBUG) console.log('processTabFocus: END / previous tab focused ',status);
                }).catch(function(error){
                    console.error('processTabFocus: END / focusTab error ',JSON.stringify(error));  
                });
            }
        }
        else {
        	if (helper.SHOW_DEBUG) console.log('processTabFocus: no previousTab to refocus ',previousTabId);
        }
        if (helper.SHOW_DEBUG) console.log('processTabFocus: END');	
	}
})