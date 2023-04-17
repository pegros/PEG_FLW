# ![Logo](/media/Logo.png) &nbsp; **sfpegFlowLaunchCmp** Flow Launch Component

## Introduction

This LWC component enables to trigger a Flow embedded within a page instead of a popup as with 
standard Quick Actions. Its main benefit compared to the standard **Flow** App Builder component
providing similar functionality is to avoid loading and initialising the Flow definition at initial
page rendering if the user does not necessarily need to launch the flow.

It also enables to launch the flow in a popup for all non record pages (i.e. Home or App) as Flow 
global actions are (still) not available.

⚠️ This LWC component replaces and extends the legacy **[sfpegFlowLaunch_CMP](/help/sfpegFlowLaunchCmpLegacy.md)**
Aura version.

---

## Component Configuration

### Global Layout

By default, a single action button is displayed.

![Flow Launch Default State](/media/sfpegFlowLaunchStart.png)

When the user clicks on the button, if popup display has been configured,
the component opens a popup to execute the Flow.

![Flow Launch Popup Execution](/media/sfpegFlowLaunchPopup.png)

Otherwise (if popup mode not configured), the component toggles in _execution_ mode
with the Flow embedded within it. Similarly to he popup a **close** icon button is
displayed on the top right to stop the flow.

![Flow Launch Inline Execution](/media/sfpegFlowLaunchInline.png)

Upon completion/closing of the flow, the component gets back to the original state (with
a single button displayed).


### Configuration

The component is easily configurable from the App Builder.

![Flow Launch Configuration](/media/sfpegFlowLaunchConfig.png)

As a baseline, the following elements are configurable 
* `Flow Name` to provide the API Name of the flow tp execute
* `Flow Input` to configure various input parameters for the Flow
    * as a JSON list of `{"name":"...","type":"...","value":"..."}` records
    * with `recordId` and `objectApiName` names being automatically 
    populated from page context if requested (e.g. via a simple
    `{"name":"recordId"}` item) 
* `Output Field for Refresh` to define the Flow output field providing a list
of record IDs for which a Lightning Data Service data refresh is requested
    * this field should be a `String` multi-value Flow variable available for output
    * no refresh being triggered if no field name is set is defined or in case of empty output field value. 
* `Start Button Label` providing the label of the main button to launch the Flow
* `Stop Button Title` providing the title of the **close** button icons (to stop the Flow)
* Various elements dedicated to the popup mode:
    * `Popup ?`to activate this mode
    * `Popup Label` to set the Popup header label
    * `Popup Size` to set the popup width
* `Wrapping CSS` to define the styling of the main containing div of the component. 


---

## Configuration Examples

### Styling Options

The following `Wrapping CSS` values enable to configure the component display differently.
* `slds-box slds-box_small slds-theme_default slds-grid slds-grid_align-end` is the default value and
aligns the **start** button to the right within a standard box.
* `slds-box slds-theme_shade slds-grid slds-grid_align-start` enables to locate the button to the left
within a greater shaded box.

### Input Parameters

The following `Flow Input` value enable to set multiple Flow input variables statically and dynamically.
```[{"name":"recordId"},{"name":"objectApiName"},{"name":"inputText","type":"String","value":"TEST Standard"}]````

The Flow should have at least 3 text variables available for input
* `recordId` which will dynamically receive the ID of the current page record (if any)
* `objectApiName` which will dynamically receive the Object API Name of the current page record (if any)
* `inputText` which will receive the configured text value (here `TEST Standard`)


---

## Technical Details

This component relies on the following standard base Lightning components:
* **[lightning-flow](https://developer.salesforce.com/docs/component-library/bundle/lightning-flow/documentation)**
for Flow execution and completion tracking
*  **[lightning-modal](https://developer.salesforce.com/docs/component-library/bundle/lightning-modal/documentation)**
for popup management (via a the **sfpegFlowPopupDsp** subcomponent)
* **[notifyRecordUpdateAvailable](https://developer.salesforce.com/docs/component-library/documentation/en/lwc/lwc.reference_notify_record_update)** method of the Lightning Data Service to refresh its record data cache

