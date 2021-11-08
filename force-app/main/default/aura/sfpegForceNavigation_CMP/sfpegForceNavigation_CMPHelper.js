({
	processInit : function(component) {
        console.log('processInit: START');
        
        let targetString = component.get("v.targetString");
        console.log('processInit: targetString fetched ', targetString);
        if (targetString) {
            let targetJSON = JSON.parse(targetString);
            if (targetJSON) {
                console.log('processInit: targetJSON parsed ', JSON.stringify(targetJSON));
                component.set("v.targetJSON",targetJSON);
            }
            else {
                console.warn('processInit: targetJSON parsing failed');                
            }
        }
        else {
            console.warn('processInit: no target defined');
        }
       
        console.log('processInit: temporary end');
    },
    processLoad : function(component) {
        console.log('processLoad: START');

        let recordId = component.get("v.recordId");
        console.log('processLoad: recordId fetched ',recordId);        
        let targetJSON = component.get("v.targetJSON");
        console.log('processLoad: targetJSON fetched ',JSON.stringify(targetJSON));
        let recordFields = component.get("v.recordFields");
        console.log('processLoad: recordFields fetched ',JSON.stringify(recordFields));
  
        // Determining target
        let targetId;
        if (targetJSON) {
        	targetJSON.forEach(function(item){
            	targetId = targetId || recordFields[item];
        	});
        }
        targetId = targetId || recordId;
        console.log('processLoad: targetId determined',targetId);
        
        // Evaluating conditions to trigger tab reopen event
        let wkspUtil = component.find("wkspUtil");
        console.log('processLoad: wkspUtil fetched',wkspUtil);
        
        let isMainTab = component.get("v.isMainTab");
        console.log('processLoad: isMainTab fetched',isMainTab);
        
        wkspUtil.isConsoleNavigation()
        .then(function(isConsole) {
            console.log('processLoad: isConsole fetched ',isConsole);
            
            if (isConsole) {
                console.log('processLoad: operating in console mode');
                wkspUtil.getEnclosingTabId()
                .then(function(tabId) {
                    console.log('processLoad: enclosing tabId fetched ',tabId);
                    return wkspUtil.getTabInfo({"tabId":tabId});
                })
                .then(function(tabInfo){
                	console.log('processLoad: enclosing tabInfo fetched ',JSON.stringify(tabInfo));             
            		if (	(recordId != targetId)
                        ||	(tabInfo.isSubtab == isMainTab) ) {
                		console.log('processLoad: triggering target tab open');                        
                        let openEvent = $A.get("e.c:sfpegTabOpen_EVT");
                		console.log('processLoad: openEvent event fetched',openEvent);                        
                        openEvent.setParams({
                            "sourceId" : tabInfo.tabId,
                            "targetId" : targetId });
       	 				openEvent.fire();
                		console.log('processLoad: END / tab open event fired');
            		}
            		else {
                		console.log('processLoad: END / target already in main tab');
            		}
                })
                .catch(function(error){
            		console.error('processLoad: END / getFocusedTabInfo error ',JSON.stringify(error));  
        		});
            }
            else {
                console.log('processLoad: operating in standard mode');
            	if (recordId != targetId) {
                	console.log('processLoad: triggering target tab open');
                    let openEvent = $A.get("e.c:sfpegTabOpen_EVT");
					openEvent.setParams({ "targetId" : targetId });
       	 			openEvent.fire();
                	console.log('processLoad: END / tab open event fired');
            	}
            	else {
                	console.log('processLoad: END / target already in tab');
            	}
            }
        })
        .catch(function(error){
            console.error('processLoad: END / isConsoleNavigation error ',JSON.stringify(error));  
        });
        console.log('processLoad: checking if in navigation mode');
    }
})