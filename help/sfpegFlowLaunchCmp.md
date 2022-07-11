---
# sfpegFlowLaunch_CMP Component
---

## Introduction

This component enables to trigger a Flow embedded within a page instead of a popup as with 
standard Quick Actions. Its main benefit compared to the standard **Flow** App Builder component
providing similar functionality is to avoid loading and initialising the Flow definition at initial
page rendering if the user does not necessarily need to launch the flow.

---

## Component Configuration

### Global Layout

By default, a single action button is displayed on the right.

![Flow Launch Initial State](/media/sfpegFlowLaunchInitial.png)

When the user clicks on the button, the component toggles in _execution_ mode with the embedded
Flow page displayed below a **close** icon button. 

![Flow Launch Execution State](/media/sfpegFlowLaunchExecuting.png)

Upon completion/closing of the flow, the component gets back to its original state (with a single
button displayed).


### Configuration

The component is easily configurable from the App Builder.

![Flow Launch Configuration](/media/sfpegFlowLaunchConfiguration.png)

As a baseline, the following elements are configurable 
* The `Label` and `Variant` of the action button to lauch the flow
* The Developer Name of the Flow to execute (as `Flow Name` parameter)
* Various flags to provide contextual information to the flow
(as `recordId` and `sObjectName` input variables)
* The ability to automatically trigger a page refresh upon flow completion./cancellation
(especially useful when using Lightning conditional display)
* Some CSS classes to tune the containing div appearance


---

## Configuration Examples

To be completed

---

## Technical Details

This component relies on the standard **[lightning:flow](https://developer.salesforce.com/docs/component-library/bundle/lightning:flow/documentation)**
Aura base component to embed and execute a Flow in an Aura component.
It listens to its state transitions to track its completion.
