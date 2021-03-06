# Customisable Components for Salesforce Flow

This package contains a set of Lightning components aiming at enhancing the Lightning Flow Experience and ease configuuration of Screen flows for various typical use cases.

They were built as contributions/examples for former & ongoing Advisory assignments by [Pierre-Emmanuel Gros](https://github.com/pegros).


They are explicitly dedicated to Flow Designer but another package with more generaly availble
components is available on this repository (see [PEG_FLW](https://github.com/pegros/PEG_FLW) package).


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


## Content of the Package

### LWC Components

* **[FlowPath](/help/sfpegFlowPathFlw.md)**: primarily enables to display the progress of stages within a Flow (but may also be configured to be used actively to control navigation among Flow pages)

![Flow Path](/media/FlowPath.png)

* **[ListSelector](/help/sfpegListSelectorFlw.md)**: enables to select one record (provided as output) out of a list provided as input, each record being displayed as a tile with a set of fields defined in a fieldset.

![List Selector](/media/ListSelector.png)

* **[ListMultiSelectorFlw](/help/sfpegListMultiSelectorFlw.md)**: similar to the ListSelector but in multi-select mode with a search bar

![List Multi-Selector](/media/ListMultiSelect.png)

* **[CheckboxSelectFlw](/help/sfpegCheckboxSelectFlw.md)** : enables to select multiple items within a single record list via multiple checkbox groups.

![Checkbox Selector](/media/CheckboxSelect.png)

* **[RecordEdit](/help/sfpegRecordEditFlw.md)**: enables to display a record card in edit/read mode based on a fieldset, taking a Flow record as input and providing a possibly modified record as output

![Record Edit Form](/media/RecordEdit.png)

* **[RecordList](/help/sfpegRecordListFlw.md)**: displays a list  of records and enables to launch various actions conditionally.

![Record List](/media/RecordList.png)

* **[RecordMerge](/help/sfpegRecordMergeFlw.md)**: enables to merge 2 records provided as input into another one as output, based on a fieldset, the user being also able to modify it manually.

![Record Merge Form](/media/RecordMerge.png)


### Invocable Apex Actions

* **Get Duplicates**: to get the list of records matching a given record via applicable duplicate rules (and the concatenated corresponding warnings)

* **Get Records Data**: to get a same set of fields (via a fieldset) for a list of records (e.g. the duplicates for which data of the compact layout is returned)

* **Execute DML**: to bypass “warn” duplicate rules upon record insert / update.

Please refer to **[Flow Actions](/help/sfpegFlowApexActions.md)**.

### Aura Components

* **[FlowLaunch](/help/sfpegFlowLaunchCmp.md)**: App Builder component enabling to execute a Flow 
embedded within a page, while initialising and launching it only upon explicit user request.

* **[FlowEmbed](/help/sfpegFlowEmbedCmp.md)**: addressable component enabling to properly display, execute and terminate a Flow launched via URL, the user being redirected to a target record provided as output of the Flow upon completion

* **NavigationManager**: utility bar component handling the redirection requests in console mode, in order to open the target record page, close the Flow page and ensure proper focus on the target record page.

* **ForceNavigation**: invisible component working with the **NavigationManager** to force the display of a record in main tab / subtab of a Lightning console App.

See standard Aura documentation of the components for details.

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
