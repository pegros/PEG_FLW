({
    initComponent : function(component,event,helper) {
        console.log('initComponent: START');

        let pageReference = component.get("v.pageReference");
        console.log('initComponent: pageReference fetched',JSON.stringify(pageReference));
        let state = pageReference.state;
        console.log('initComponent: state fetched',JSON.stringify(state));

        // Parsing the Inputs        
        if (! state.c__flow) {
            console.error('initComponent: END / missing flow name');
            component.set("v.errorMessage","Missing Flow Name in the URL parameters!");
            return;
        }
        console.log('initComponent: flow name present',state.c__flow);
        component.set("v.flowName", state.c__flow);
        /*
        if (! state.c__input) {
            console.error('initComponent: END / missing input');
            return;
        }
        let inputVar = JSON.parse(state.c__input);
        console.error('initComponent: inputVar parsed ',inputVar);
        if (! inputVar) {
            console.error('initComponent: END / input config parsing issue');
            return;
        }
        */
        if (state.c__isDebug) {
            console.log('initComponent: setting debug mode');
            component.set("v.isDebug",true);
        }

        if (! state.c__target) {
            console.error('initComponent: END / missing target');
            component.set("v.errorMessage","Missing Target Variable Name in the URL parameters!");
            return;
        }
        component.set("v.target", state.c__target);
        console.log('initComponent: target set ',state.c__target);

        let inputVar = [];
        if (state.c__recordId) {
            console.log('initComponent: registering record ID ', state.c__recordId);
            component.set("v.recordId", state.c__recordId);
            inputVar.push({
                name: "recordId",
                type: "String",
                value: state.c__recordId
            });
        }
        console.log('initComponent: inputVar init',inputVar);

        // Launching the Flow
        let flowContainer = component.find("flowContainer");
        console.log('initComponent: flow fetched',flowContainer);
        flowContainer.startFlow(state.c__flow, inputVar);
        console.log('initComponent: flow started');

        // Resetting the Tab label
        if (state.c__label) {
            console.log('initComponent: changing tab label',state.c__label);

            let wkAPI = component.find("workspaceUtil");
            console.log('initComponent: wkAPI',wkAPI);

            wkAPI.isConsoleNavigation().then(function(consoleMode) {
            	console.log('initComponent: console mode',consoleMode);
            	if (consoleMode) return wkAPI.getEnclosingTabId();
            }).then(function(tabId){
                console.log('initComponent: tab ID fetched',tabId);
                return wkAPI.setTabLabel({
                    tabId: tabId,
                    label: state.c__label || "Flow"
                });
            }).then(function(tabInfo){
                console.log('initComponent: tab renamed',tabInfo);
                return wkAPI.setTabIcon({
                    tabId: tabInfo.tabId,
                    iconAlt: "Flow",
                    icon: "standard:flow"
                });
            }).then(function(tabInfo){
                console.log('initComponent: tab icon changed',tabInfo);
            }).catch(function(error) {
                console.error('initComponent: error raised',JSON.stringify(error));
                component.set("v.errorMessage",JSON.stringify(error));
            });   
        } 
        else {
            console.log('initComponent: no tab label provided');
        }
        console.log('initComponent: END');
    },
    navigate2target : function(component,event,helper) {
        console.log('navigate2target: START');

        let outputVar = event.getParam("outputVariables");
        console.log('navigate2target: outputVar fetched',JSON.stringify(outputVar));

        let target = component.get("v.target");
        console.log('navigate2target: target fetched',target);

        let targetId = null;
        outputVar.forEach(function(item) {
            if (item.name == target) targetId = item.value;
        });

        let pageReference;
        if (!targetId) {
            console.warn('navigate2target: no targetId found, redirecting to home');
            pageReference = {
                type: 'standard__namedPage',
                attributes: {
                    pageName: "home"
                }
            };
        }
        else {
            console.log('navigate2target: redirecting to targetId ',targetId);
            pageReference = {
                type: "standard__recordPage",
                attributes: {
                    recordId: targetId,
                    actionName: "view"
                }
            };
        }
        console.log('navigate2target: target pageReference init',pageReference);

        let wkspUtil = component.find("workspaceUtil");
        console.log('navigate2target: wkspUtil fetched',wkspUtil);

        wkspUtil.isConsoleNavigation()
        .then(function(isConsole) {
            console.log('navigate2target: isConsole fetched ',isConsole);

            if (isConsole) {
                console.log('navigate2target: operating in console mode');
                wkspUtil.getEnclosingTabId()
                .then(function(tabId) {
                    console.log('navigate2target: enclosing tabId fetched ',tabId);

                    //let openEvent = $A.get('e.c' + ':sfpegTabOpen_EVT');
                    let openEvent = $A.get('e.c:sfpegTabOpen_EVT');
                    console.log('navigate2target: event fetched ',openEvent);
                    openEvent.setParams({
                        sourceId: tabId,
                        targetPage: pageReference });
                    openEvent.fire();
                    console.log('navigate2target: END / tab open event fired');
                })
                .catch(function(error){
                    console.error('navigate2target: END / error in getting tab ID',JSON.stringify(error));  
                });
                console.log('navigate2target: fetching enclosing tab ID');
            }
            else {
                console.log('navigate2target: operating in standard mode');

                let navService = component.find("navService");
                navService.navigate(pageReference);

                console.log('navigate2target: END / standard navigation triggered');
            }
        })
        .catch(function(error){
            console.error('navigate2target: END / error in checking console mode ',JSON.stringify(error));  
        });
        console.log('navigate2target: checking if in console mode');  
    }
})