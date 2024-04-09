# ![Logo](/media/Logo.png) &nbsp; **sfpegForceRedirectFlw** Record Redirection Component

## Introduction

This component for Flow pages enables to automatically redirect the User to a
record page when entering the page. 

It automatically terminates the flow if possible (if included in a terminating Flow page).

This component is invisible when the logic is executed automatically
(i.e. when not in debug mode).


---

## Component Configuration
 
Configuration is completely done in the Flow Builder via the following
available properties:
* `Record Id`: ID of the record to which redirection should be done
* `objectApiName`: Object Name of the record to which redirection should be done (required in LWR Sites).
* `Debug?`: Flag to activate debug information display and logging (then
displaying a button for manual logic trigger)


---

## Technical Details

This component relies on the following standard base Lightning components and methods:
* the [navigation](https://developer.salesforce.com/docs/component-library/bundle/lightning-navigation/documentation) service to open the target record page
* the [flow navigation](https://developer.salesforce.com/docs/component-library/bundle/lightning-flow-support/documentation) events for flow page control 
