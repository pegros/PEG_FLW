({
    SHOW_DEBUG : false,
    initComponent : function(component,event,helper) {
        //console.log('initComponent: START');
        let pageReference = component.get("v.pageReference");
        console.log('initComponent: pageReference fetched',JSON.stringify(pageReference));
        let state = pageReference.state;
        helper.SHOW_DEBUG = state.c__isDebug;
        if (helper.SHOW_DEBUG) console.log('initComponent: START with state ',JSON.stringify(state));

        // Parsing the Inputs        
        if (! state.c__flow) {
            console.error('initComponent: END / missing flow name');
            component.set("v.errorMessage","Missing Flow Name in the URL parameters!");
            return;
        }
        if (helper.SHOW_DEBUG) console.log('initComponent: flow name present',state.c__flow);
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
            if (helper.SHOW_DEBUG) console.log('initComponent: setting debug mode');
            component.set("v.isDebug",true);
        }

        if (! state.c__target) {
            console.error('initComponent: END / missing target');
            component.set("v.errorMessage","Missing Target Variable Name in the URL parameters!");
            return;
        }
        component.set("v.target", state.c__target);
        if (helper.SHOW_DEBUG) console.log('initComponent: target set ',state.c__target);

        let inputVar = [];
        if (state.c__recordId) {
            if (helper.SHOW_DEBUG) console.log('initComponent: registering record ID ', state.c__recordId);
            component.set("v.recordId", state.c__recordId);
            inputVar.push({
                name: "recordId",
                type: "String",
                value: state.c__recordId
            });
        }
        if (helper.SHOW_DEBUG) console.log('initComponent: inputVar init',inputVar);

        // Launching the Flow
        let flowContainer = component.find("flowContainer");
        if (helper.SHOW_DEBUG) console.log('initComponent: flow fetched',flowContainer);
        flowContainer.startFlow(state.c__flow, inputVar);
        if (helper.SHOW_DEBUG) console.log('initComponent: flow started');

        // Resetting the Tab label
        if (state.c__label) {
            if (helper.SHOW_DEBUG) console.log('initComponent: changing tab label',state.c__label);

            let wkAPI = component.find("workspaceUtil");
            if (helper.SHOW_DEBUG) console.log('initComponent: wkAPI',wkAPI);

            wkAPI.isConsoleNavigation().then(consoleMode => {
                if (helper.SHOW_DEBUG) console.log('initComponent: console mode',consoleMode);
                if (consoleMode){
                	wkAPI.getEnclosingTabId().then( tabId => {
                		if (helper.SHOW_DEBUG) console.log('initComponent: tab ID fetched',tabId);
                		if (tabId) return wkAPI.setTabLabel({
                    		tabId: tabId,
                    		label: state.c__label || "Flow"
                		});
            			throw new Error('tab ID not found');
		            }).then( tabInfo => {
                		if (helper.SHOW_DEBUG) console.log('initComponent: tab renamed',tabInfo);
                		if (tabInfo) return wkAPI.setTabIcon({
                    		tabId: tabInfo.tabId,
                    		iconAlt: "Flow",
                    		icon: "standard:flow"
                		});
        				throw new Error('tab info not found');
		            }).then( tabInfo => {
                		if (helper.SHOW_DEBUG) console.log('initComponent: tab icon changed',tabInfo);
            		});
				}
                else {
                		if (helper.SHOW_DEBUG) console.log('initComponent: not in console mode');                    
                }
			}).catch(function(error) {
                console.error('initComponent: error raised',JSON.stringify(error));
                component.set("v.errorMessage",JSON.stringify(error));
            });   
        } 
        else {
            if (helper.SHOW_DEBUG) console.log('initComponent: no tab label provided');
        }
        if (helper.SHOW_DEBUG) console.log('initComponent: END');
    },
    navigate2target : function(component,event,helper) {
        helper.SHOW_DEBUG = component.get("v.isDebug");
        if (helper.SHOW_DEBUG) console.log('navigate2target: START');

        let outputVar = event.getParam("outputVariables");
        if (helper.SHOW_DEBUG) console.log('navigate2target: outputVar fetched',JSON.stringify(outputVar));

        let target = component.get("v.target");
        if (helper.SHOW_DEBUG) console.log('navigate2target: target fetched',target);

        let targetId = null;
        outputVar.forEach(function(item) {
            if ((!targetId) && (item.name == target)) targetId = item.value;
        });
        if (helper.SHOW_DEBUG) console.log('navigate2target: targetId fetched',targetId);

        if (!targetId) {
            targetId = component.get("v.recordId");
            console.warn('navigate2target: redirecting to input recordId ',targetId);
        }

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
            if (helper.SHOW_DEBUG) console.log('navigate2target: redirecting to targetId ',targetId);
            pageReference = {
                type: "standard__recordPage",
                attributes: {
                    recordId: targetId,
                    actionName: "view"
                }
            };
        }
        if (helper.SHOW_DEBUG) console.log('navigate2target: target pageReference init',pageReference);

        let wkspUtil = component.find("workspaceUtil");
        if (helper.SHOW_DEBUG) console.log('navigate2target: wkspUtil fetched',wkspUtil);

        wkspUtil.isConsoleNavigation()
        .then( isConsole =>  {
            if (helper.SHOW_DEBUG) console.log('navigate2target: isConsole fetched ',isConsole);

            if (isConsole) {
                if (helper.SHOW_DEBUG) console.log('navigate2target: operating in console mode');
                wkspUtil.getEnclosingTabId()
                .then( tabId => {
                    if (helper.SHOW_DEBUG) console.log('navigate2target: enclosing tabId fetched ',tabId);

                    //let openEvent = $A.get('e.c' + ':sfpegTabOpen_EVT');
                    let openEvent = $A.get('e.c:sfpegTabOpen_EVT');
                    if (helper.SHOW_DEBUG) console.log('navigate2target: event fetched ',openEvent);
                    openEvent.setParams({
                        sourceId: tabId,
                        targetPage: pageReference });
                    openEvent.fire();
                    if (helper.SHOW_DEBUG) console.log('navigate2target: END / tab open event fired');
                })
                .catch(function(error){
                    console.error('navigate2target: END / error in getting tab ID',JSON.stringify(error));  
                });
                if (helper.SHOW_DEBUG) console.log('navigate2target: fetching enclosing tab ID');
            }
            else {
                if (helper.SHOW_DEBUG) console.log('navigate2target: operating in standard mode');

                let navService = component.find("navService");
                navService.navigate(pageReference);

                if (helper.SHOW_DEBUG) console.log('navigate2target: END / standard navigation triggered');
            }
        })
        .catch(function(error){
            console.error('navigate2target: END / error in checking console mode ',JSON.stringify(error));  
        });
        if (helper.SHOW_DEBUG) console.log('navigate2target: checking if in console mode');  
    }
})