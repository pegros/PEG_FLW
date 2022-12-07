# ![Logo](/media/Logo.png) &nbsp; **sfpegFlowPathFlw** UI Flow Component

## Introduction

This component basically displays the current step of a Flow process within a sequence of steps, leveraging the standard LWC lightning-progress-indicator component in Path mode for display.

![Flow Path](/media/FlowPath.png)

In a standard configuration,
* Admins configure the stages available for the flow and update the current stage value depending on the progress with an “assignment” node.
* In the page, the flow stage list and current stage are provided as input values to the component.

More complex configurations enable to use different sets of steps (a list of labels), different layouts (basic progress bar, tab list) and let this component be “active” (i.e. trigger the Flow “next” event while providing the selected step/tab as output). 

![Flow Path as Progress Bar](/media/FlowPathBar.png)

Flow Path as Progress Bar

![Flow Path as Tab Set](/media/FlowPathTabs.png)

Flow Path as Tab Set


---

## Component Configuration

### Global Layout

To be continued

### Flow Builder Configuration

To be continued

---

## Configuration Examples

To be continued

---

## Technical Details

To be continued
