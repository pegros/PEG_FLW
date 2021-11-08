({
	processInit : function(component,event,helper) {
        console.log('processInit: START');
        
        let targetPageRef = component.get("v.targetPageRef");
        console.log('processInit: targetPageRef fetched ', targetPageRef);
        if (targetPageRef) {
            let targetPageJson = JSON.parse(targetPageRef);
            if (targetPageJson) {
                console.log('processInit: targetPageJson parsed ', JSON.stringify(targetPageJson));
           
                let wkspUtil = component.find("wkspUtil");
        		console.log('processInit: wkspUtil fetched',wkspUtil);
        
        		wkspUtil.isConsoleNavigation()
        		.then(function(isConsole) {
            		console.log('processInit: isConsole fetched ',isConsole);
            
            		if (isConsole) {
                		console.log('processInit: operating in console mode');
                		wkspUtil.getEnclosingTabId()
                		.then(function(tabId) {
                    		console.log('processInit: enclosing tabId fetched ',tabId);
                      
                       		let openEvent = $A.get("e.c:sfpegTabOpen_EVT");
                        	openEvent.setParams({
                            	"sourceId" : tabId,
                            	"targetPage" : targetPageJson });
       	 					openEvent.fire();
                			console.log('processInit: END / tab open event fired');
                        })
                        .catch(function(error){
            				console.error('processInit: END / error in getting tab ID',JSON.stringify(error));  
        				});
                		console.log('processInit: fetching enclosing tab ID');
            		}
            		else {
                        console.log('processInit: operating in standard mode');

                    	let openEvent = $A.get("e.c:sfpegTabOpen_EVT");
						openEvent.setParams({ "targetPage" : targetPageJson });
       	 				openEvent.fire();
                		console.log('processInit: END / tab open event fired');
            		}
                })
                .catch(function(error){
            		console.error('processInit: END / error in checking consoe mode ',JSON.stringify(error));  
        		});
            	console.error('processInit: checking if in console mode');  
            }
            else {
                console.warn('processInit: targetPageJson parsing failed');                
            }
        }
        else {
            console.warn('processInit: no targetPageRef defined');
        }
        console.log('processInit: END');        
	}
})