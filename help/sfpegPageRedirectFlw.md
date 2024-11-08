# ![Logo](/media/Logo.png) &nbsp; **sfpegPageRedirectFlw** Record Refresh and Page Redirection Component

## Introduction

This component for Flow pages enables to automatically (when entering the page) or manually (via button click) execute all or any of the following operations (in this order):
* force the LDS refresh of a list of records (to refresh the current local cache when DML operations have been done from the Flow).
* redirect the User to any page (e.g. to the standard page of a record just created)
* trigger a move to the next page of the flow or its completion (e.g. when the flow is used in console mode in a tab)

This component is invisible when the logic is executed automatically
or displays a single button when manual trigger is configured (e.g. to
display a message above).


---

## Component Configuration
 
Configuration is completely done in the Flow Builder via the following
available properties:
* `Show Button?`: Boolean Flag to display a button to trigger redirection instead of automatically triggering it upon initialisation.
* `Button Label`: Label of the navigation button displayed when not in automatic mode.
* `buttonTitle`: Title displayed when hovering over the navigation button displayed when not in automatic mode.
* `Button Variant`: Variant of the navigation button displayed when not in automatic mode (base, neutral, brand, brand-outline, destructive, destructive-text, inverse or success).
* `Wrapping CSS`: CSS styling classes for the button container (e.g `slds-float_right` to align the button on the right)
* `Target Page Reference`: Page reference towards which redirection should be done. Please refer to [documentation](https://developer.salesforce.com/docs/platform/lwc/guide/reference-page-reference-type.html) for its JSON structure syntax, some examples being provided hereafter.
* `Record IDs to refresh`: List of record IDs to refresh before redirecting, as a list of string (requires a flow multi-value text variable to be initialized via `assignment` nodes).
* `Trigger Next/Finish?`: Flag to automatically move to the next page (when in middle of flow) or complete the flow (when at the end of it)
* `Debug?`: Flag to activate debug information display and logging

⚠️ **Warning**: default values for properties may not be properly injected in the component configuration (Standard Flow Builder issue) and you may need to explicitly reselect/reenter the provided default values (e.g. `Wrapping CSS` or `Trigger Next/Finish?`).


### Target Page Reference Examples

To navigate to a specific **record page**:
```
{
    "type": "standard__recordPage",
    "attributes": {
        "recordId": "a1wAP000000vydoYAA",
        "actionName": "view",
        "objectApiName": "CustomObject__c"
    }
}
```

To navigate to a specific **App page**:
```
{
    "type": "standard__navItemPage",
    "attributes": {
        "apiName": "CustomAppPageName"
    }
}
```

---

## Technical Details

This component relies on the following standard base Lightning components and methods:
* the [notifyRecordUpdateAvailable](https://developer.salesforce.com/docs/platform/lwc/guide/reference-notify-record-update.html?q=notifyRecordUpdateAvailable) wire service for Lightning Data Service record reload
* the [navigation](https://developer.salesforce.com/docs/component-library/bundle/lightning-navigation/documentation) service to open the target page
* the [flow navigation](https://developer.salesforce.com/docs/component-library/bundle/lightning-flow-support/documentation) events for flow page control 
