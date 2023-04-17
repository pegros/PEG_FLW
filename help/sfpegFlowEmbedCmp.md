# ![Logo](/media/Logo.png) &nbsp; **sfpegFlowEmbedCmp** Flow Embedding Tab Component

## Introduction

This component enables to execute any Flow in a dedicated Lightning Tab (with proper layout) and automatically
redirect the user to a target page determined as output of the Flow after having possibly forced a **Lightning
Data Service** data refresh of some records (also determined by the Flow).

⚠️ This LWC component tends to replace and extends the legacy **[sfpegFlowEmbed_CMP](/help/sfpegFlowEmbedCmpLegacy.md)**
Aura version. It still does not address console mode properly (to close the flow tab upon redirection).


---

## Component Configuration

### Global Layout

By default, the flow is launched within a standard Lightning Tab.

![Flow Embed Execution](/media/sfpegFlowEmbedExecuting.png)

Most parameters are provided as state parameters (see URL) when redirecting the user
to this page, these parameters being used by the component or pushed as input
parameters to the Flow.

### Tab Configuration

In order to use the component, a Lightning Tab should be configured in Setup.

![Flow Embed Tab Configuration](/media/sfpegFlowEmbedConfig.png)

Notes:
* At least one such Tab needs to be configured.
* The label configured corresponds to the tab being displayed in the App and
admins may define different tabs to have labels matching the process executed
in the Flow.

### Redirection to the Flow Tab

Opening the Lightning tab may be done in various ways.

#### Base Page Reference

Via the **[Lightning navigation](https://developer.salesforce.com/docs/component-library/bundle/lightning-navigation/documentation)**
service, the target page reference is simply:
```
{
  "type":"standard__navItemPage",
  "attributes": {
    "apiName":"TST_Name"
  },
  "state":{
    "c__flow":"TST_Flow",
    "c__target":"target",
    "c__isDebug":true,
    "c__inputText":"Test"
  }
}
```
In this exemple, 
* `TST_Name` is the API Name of the Lightning Tab hosting the flow execution
* `c__flow` (mandatory) provides the API name of the Flow to be executed
* `c__target` (optional) provides the name of the Flow output field to be used to fetch the IDs
of the records to refresh upon Flow termination
* `c__target` (optional) enables to activate debug logs
* all other `state` parameters are considered as `String` input parameters to the Flow with
(`c__inputText` being pushed as `inputText` flow parameter)

⚠️ `c__` prefix in state paremeters is required so that their corresponding values are properly pushed to the Tab.


#### Navigation Button

The contextualised URL of the previous example may be easily built as follows:
`/lightning/n/TST_Name?c__flow=TST_Flow&c__inputText=Test&c__target=target&c__isDebug=true`

More generally, URL buttons may be configured on record page to launch the Flow in a 
contextualised way.
![Flow Embed Navigation Configuration](/media/sfpegFlowEmbedNavigation.png)


---

## Technical Details

When in console mode, it works in conjunction with the utility bar **sfpegNavigationManager_CMP** component to 
close the current tab and open/redirect to the target upon Flow completion.

When in standard mode, it directly relies on the **[lightning:navigation](https://developer.salesforce.com/docs/component-library/bundle/lightning:navigation/documentation)** standard utility component to
redirect the user to the target page.

It relies on the **[lightning:workspaceAPI](https://developer.salesforce.com/docs/component-library/bundle/lightning:workspaceAPI/documentation)** standard utility component to determine whether it is in console mode.