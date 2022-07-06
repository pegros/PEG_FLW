---
# sfpegFlowEmbed_CMP Component
---

## Introduction

This component enables to execute any Flow in a dedicated Lightning page (or tab in console mode)
and automatically redirect the user to the proper record decided by the Flow, automatically closing the 
Flow tab when in console mode.

It provides a proper component display in a Lightning App (from a SLDS styling perspective) and 
also enables to adapt the tab label displayed.

When no target record is provided in output, the user is automatically redirecte to the home page.


---

## Component Configuration

### Global Layout

You may easily launch a Flow in the FlowEmbed component via an URL button on a record.

![Flow Embed](/media/FlowEmbed.png)


### Configuration

This button juste needs to be declared in the Object setup as a detail page button.

![Flow Embed Button](/media/FlowEmbedButton.png)

As Content Source, you just need to build a relative URL built with: 
* The FlowEmbed relative URL (`/lightning/cmp/c__sfpegFlowEmbed_CMP?`)
* The devName of the Flow to execute (as `c__flow` parameter)
* A possible recordID (optional) to be provided as Flow input (as `c__recordId` parameter)
* The Flow field providing the target record ID to be opened upon completion (as `c__recordId` parameter).
* The (optional) tab label (as `c__label` parameter)

As an example
```
/lightning/cmp/c__sfpegFlowEmbed_CMP?c__flow=Account_CreationPP&c__target=TargetId&c__label=Création_PP
```

---

## Configuration Examples

For the time being, it is only possible to redirect the User to a record when ending the Flow,
usually one of the record having been created / selected in the Flow or back to the original
one (if the `c__recordId` input parameter was provided).


### Launch from custom Lightning component

You may easily open the flow tab from any custom lightning code leveraging the Aura navigation service,
e.g. upon click of a button.

```
let flowName = component.get("v.flowName");
let tabLabel = component.get("v.tabLabel");
let recordId = component.get("v.recordId");
let navService = component.find("navService"); 
let pageReference = {
  "type": "standard__webPage", 
  "attributes": {
    "url":
"/lightning/cmp/c__sfpegFlowEmbed_CMP?c__flow=" + flowName + "&c__recordId=" + saveResult.recordId + "&c__target=targetId&c__label=" + tabLabel
  }
};
navService.navigate(pageReference,false);
```

---

## Technical Details

When in console mode, it works in conjunction with the utility bar **sfpegNavigationManager_CMP** component to 
close the current tab and open/redirect to the target upon Flow completion.

When in standard mode, it directly relies on the **[lightning:navigation](https://developer.salesforce.com/docs/component-library/bundle/lightning:navigation/documentation)** standard utility component to
redirect the user to the target page.

It relies on the **[lightning:workspaceAPI](https://developer.salesforce.com/docs/component-library/bundle/lightning:workspaceAPI/documentation)** standard utility component to determine whether it is in console mode.