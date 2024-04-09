# ![Logo](/media/Logo.png) &nbsp; SFPEG **FLOW** Components

This package contains a set of highly customisable Lightning components aiming at enhancing the Lightning UI Flow Experience and ease configuuration of Screen flows for various typical use cases.

They were built as contributions/examples for former & ongoing Advisory assignments by [Pierre-Emmanuel Gros](https://github.com/pegros).


They are explicitly dedicated to Flow Designer but another package with more generaly available
components is available on this repository (see [PEG_LIST](https://github.com/pegros/PEG_LIST) package).

⚠️ In Winter 23 release, many new features have been added to Flows. Please investigate them first
before considering the components in this package (especially Flow Forms and Flow Tables).

ℹ️ You may also have a look at **[UnofficialSF](https://unofficialsf.com/)** to find other interesting
components.

## Introduction

Flows have progressed a lot over the recent releases and provide a powerful way to implement various functionalities on the platform. They enable to replace complex Lighting components / pages by streamlined guided processes directly configurable.

However, some simple interaction requirements are not supported:
* Display the progress of a flow graphically (e.g. leveraging the standard “stages”)
* Select one record out of a list fetched via a “getRecord” node
* ~~Leverage the full width of a flow page to display/edit record data efficiently (e.g. fields on 3 columns)~~
* Simply merge data from a Salesforce record with data fetched from an external source

Implementing custom Lightning components each time there is a similar use case is not a sustainable approach (in terms of implementation/maintenance delays/costs, UX consistency, performances…).

A core set of 6 **flow ready** LWC components has been implemented to address these needs in a generic, configurable way. 

At last, a key design pattern is to clearly separate User Interaction from data logic.
The Flow process is in charge of getting / processing / updating record data
while the Components only display record data and supports local user interaction
(selection, data input) in the browser. 

⚠️ **Warning**: the provided components often provide default values for properties. However, you might need to actually reconfigure these default
values for them to be actually taken into account (Standard Flow Builder 
issue).


## Content of the Package

### LWC Components

#### **[FlowPath](/help/sfpegFlowPathFlw.md)**

This component primarily enables to display the progress of stages within a Flow (but may also be configured to be used actively to control navigation among Flow pages)

![Flow Path](/media/FlowPath.png)

#### **[ListSelector](/help/sfpegListSelectorFlw.md)**

This component enables to select one record (provided as output) out of a list provided as input, each record being displayed as a tile with a set of fields defined in a fieldset.

![List Selector](/media/ListSelector.png)

#### **[ListMultiSelectorFlw](/help/sfpegListMultiSelectorFlw.md)**

This component is similar to the ListSelector but in multi-select mode with a search bar

![List Multi-Selector](/media/ListMultiSelect.png)


#### **[CheckboxSelectFlw](/help/sfpegCheckboxSelectFlw.md)**

This component enables to select multiple items within a single record list via multiple checkbox groups.

![Checkbox Selector](/media/CheckboxSelect.png)


#### **[RecordEdit](/help/sfpegRecordEditFlw.md)**

This component enables to display a record card in edit/read mode based on a fieldset, taking a Flow record as input and providing a possibly modified record as output

![Record Edit Form](/media/RecordEdit.png)


#### **[RecordList](/help/sfpegRecordListFlw.md)**

This component displays a list of records and enables to launch various actions conditionally.

![Record List](/media/RecordList.png)


#### **[RecordMerge](/help/sfpegRecordMergeFlw.md)**

This component enables to merge 2 records provided as input into another one as output, based on a fieldset, the user being also able to modify it manually.

![Record Merge Form](/media/RecordMerge.png)


#### **[FlowLaunch](/help/sfpegFlowLaunchCmp.md)**

This App Builder component enables to execute a Flow embedded within a page,
while initialising and launching it only upon explicit user request.
It also supports executing it in a Popup for pages where Flow Quick Actions are 
not available.


#### **[FlowEmbed](/help/sfpegFlowEmbedCmp.md)**

This Tab component enables to properly display, execute and terminate
a Flow from a Lightning Tab, the user being redirected to a target page
provided as output of the Flow upon completion.


#### **[ForceRedirect](/help/sfpegForceRedirectFlw.md)**

This component for Flow pages enables to automatically redirect the User to a
record page from within a terminating Flow page.


#### **[PageRedirect](/help/sfpegPageRedirectFlw.md)**

This component for Flow pages enables to automatically (when entering the page) or manually (via button click) execute all or any of the following operations (in this order):
* force the LDS refresh of a list of records (to refresh the current local cache when DML operations have been done from the Flow).
* redirect the User to any page (e.g. to the standard page of a record just created)
* trigger a move to the next page of teh flow or its completion (e.g. when the flow is used in console mode in a tab)


### Invocable Apex Actions

* **Get Duplicates**: to get the list of records matching a given record via applicable duplicate rules (and the concatenated corresponding warnings)

* **Get Records Data**: to get a same set of fields (via a fieldset) for a list of records (e.g. the duplicates for which data of the compact layout is returned)

* **Execute DML**: to bypass “warn” duplicate rules upon record insert / update.

Please refer to **[Flow Actions](/help/sfpegFlowApexActions.md)** for details.


### Aura Components

#### **[FlowLaunch (legacy)](/help/sfpegFlowLaunchCmpLegacy.md)**

This App Builder component enables to execute a Flow embedded within a page,
while initialising and launching it only upon explicit user request.

#### **[FlowEmbed (legacy)](/help/sfpegFlowEmbedCmpLegacy.md)**

This addressable component enables to properly display, execute and terminate
a Flow launched via URL, the user being redirected to a target record provided
as output of the Flow upon completion.

#### **NavigationManager**

This utility bar component handling the redirection requests in console mode, in order to open the target record page, close the Flow page and ensure proper focus on the target record page.

#### **ForceNavigation**

This component is not directly related to flows but included in the package as it uses features
provided by the **NavigationManager** and may happen to be helpful when designing a Lightning
console App.

This invisible component, working with the **NavigationManager**, enables to force the display of a record in main tab / subtab of a Lightning console App.

### Utility Aura Apex Controllers

* **GetFieldset**: to retrieve the set of fields contained in a fieldset and authorized for the current user (via FLS), to be used in LWC components & Apex actions


### Technical Details

For dependency reasons, you may need first to deploy the **sfpegTabOpen_EVT** Aura
Lightning Event alone before being able to deploy the whole package via SFDX, ie. 
running a targeted deploy
> sfdx force:source:deploy -w 10 --verbose -p force-app/main/default/aura/sfpegTabOpen_EVT

before executing the whole deploy
> sfdx force:source:deploy -w 10 --verbose -p force-app/main/default

### Miscellaneous

The **[PEG_LIST](https://github.com/pegros/PEG_LIST)** package may also be 
leveraged to launch Flows in popups from the utility bar
(see its **[sfpegActionUtility](https://github.com/pegros/PEG_LIST/blob/master/help/sfpegActionUtilityCmp.md)** component).

## Installation
<a href="https://githubsfdeploy.herokuapp.com?ref=master">
  <img alt="Deploy to Salesforce"
       src="https://raw.githubusercontent.com/afawcett/githubsfdeploy/master/deploy.png">
</a>
