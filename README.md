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
Leverage the full width of a flow page to display/edit record data efficiently (e.g. fields on 3 columns)
* Simply merge data from a Salesforce record with data fetched from an external source

Implementing custom Lightning components each time there is a similar use case is not a sustainable approach (in terms of implementation/maintenance delays/costs, UX consistency, performances…).

A core set of 6 **flow ready** LWC components has been implemented to address these needs in a generic, configurable way. 

Additional objective was to keep the control of data fetch/save within the Flow logic (not in the components)

## Content of the Package

4 LWC components:
* **FlowPath**: primarily enables to display the progress of stages within a Flow (but may also be configured to be used actively to control navigation among Flow pages)
* **ListSelector**: enables to select one record (provided as output) out of a list provided as input, each record being displayed as a tile with a set of fields defined in a fieldset.
* **ListMultiSelector**: similar to the ListSelector but in multi-select mode with a search bar
* **RecordEdit**: enables to display a record card in edit/read mode based on a fieldset, taking a Flow record as input and providing a possibly modified record as output
* **RecordList**: displays a list  of records and enables to launch various actions conditionally.
* **RecordMerge**: enables to merge 2 records provided as input into another one as output, based on a fieldset, the user being also able to modify it manually.

3 invocable Apex Actions:
* **Get Duplicates**: to get the list of records matching a given record via applicable duplicate rules (and the concatenated corresponding warnings)
* **Get Records Data**: to get a same set of fields (via a fieldset) for a list of records (e.g. the duplicates for which data of the compact layout is returned)
* **Execute DML**: to bypass “warn” duplicate rules upon record insert / update.

2 Aura components :
* **FlowEmbed**: addressable component enabling to properly execute and terminate a Flow launched via URL, the user being redirected to a target record provided as output of the Flow upon completion
* **NavigationManager**: utility bar component handling the redirection requests in console mode, in order to open the target record page, close the Flow page and ensure proper focus on the target record page.
* **ForceNavigation**: invisible component working with the **NavigationManager** to force the display of a record in main tab / subtab of a Lightning console App.

1 utility Aura Apex Controller
* **GetFieldset**: to retrieve the set of fields contained in a fieldset and authorized for the current user (via FLS), to be used in LWC components & Apex actions

## Configuration

### Flow Path

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


### List Selector

This component enables to simply select a record from a list provided as input.
* The type of object has to be first selected
* The list of records is provided as input
* The selected record is provided as output (but may be provided as input as well for init)

![List Selector](/media/ListSelector.png)

The display of each individual record is configured by providing
* The display mode (list, tiles, table)
* The Name field to be used as tile title
* The fieldset dev name listing the fields to be displayed as tile details

No validation is enforced to check that a record is actually selected when the user clicks on “next”
This control must be done explicitly in the Flow.

![List Selector as List](/media/ListSelectorList.png)

List Selector as simple List

![List Selector as Table](/media/ListSelectorTable.png)

List Selector tor as Table


### List Multi-Selector

This component enables to select a set of records from a list provided as input.
* The type of object has to be first selected
* The list of records is provided as input
* The selected record is provided as output (but may be provided as input as well for init)

![List Multi-Selector](/media/ListMultiSelect.png)

Card Title & Icon are optional and configurable. The selected records may clearly  appears in a pill list (and be easily deselected). Selected records are also highlighted in the possibly filtered record list. Details are configured via a FieldSet on the applicable object (the exact set of fields being automatically filtered according to FLS) Only simple field types are supported: string, date, numbers !

The display of each individual record is configured by providing
* The display mode (tiles, table)
* The Name field to be used as tile title
* The fieldset dev name listing the fields to be displayed as tile details

No validation is enforced to check that a record is actually selected when the user clicks on “next”. This control must be done explicitly in the Flow.

![List Multi-Selector as Table](/media/ListMultiSelectTable.png)

“Table” mode shows field names next to values. The height of the display list may also be set to trigger a scroll. The width of each tile is configurable (as a ratio of a 12 unit grid).


### Record Edit

This component leverages the standard LWC **[lightning-record-edit-form](https://developer.salesforce.com/docs/component-library/bundle/lightning-record-edit-form/documentation)** component to easily display, fill or modify a record Flow variable 
* The type of object has to be first selected
* The original record is provided as input
* The (updated) record is provided as output

![Record Edit Form](/media/RecordEdit.png)

Card Title & Icon are optional and configurable. The number of fields on each row is configurable.

The list of fields displayed is configured via a fieldset (dev name as input) with 2 options
* Use the standard meaning of the  ”required” field attribute in the fieldset
* Map the required/optional values to read-write/read-only
* (User FLS being always applied anyway)

![Record Edit Form RW](/media/RecordEditRW.png)

As for List Selector, no validation is enforced to check that all required fields are properly filled
This control must be done explicitly in the Flow

The component relies on the **[lightning-record-edit-form](https://developer.salesforce.com/docs/component-library/bundle/lightning-record-edit-form/documentation)** ccomponent and thus requires the _recordTypeId_ (if applicable) to be provided in the input record (even if not displayed) for the picklists to be properly filtered. When using dependent picklists, parent fields must also be included in the FieldSet.

### Record Merge

This component leverages the standard LWC **[lightning-record-edit-form](https://developer.salesforce.com/docs/component-library/bundle/lightning-record-edit-form/documentation)** component to provide a User controlled way to merge 2 record Flow variables
* The type of object has to be first selected
* The main and second records are provided as input
* The target record is provided as output
* The list of fields displayed is configured via a fieldset (dev name as input)

![Record Merge Form](/media/RecordMerge.png)

Card Title & Icon are optional and configurable. The selected target field value source is clearly identified. The source of each field value may be selected individually All field values of a record may be selected at once via the top selector.

The target is initialized out of the main record and the User may then 
* Select all displayed field values of a record
* Select individual fied values 
* Override a target value manually

Alternate variants enable to 
* Stack field labels vertically
* Remove manual override option

![Record Merge Form in 2 colums](/media/RecordMerge2.png)

The field label may be stacked vertically. The manual target value override may be hidden.


### Record List

This component enables to display a list of records and provide options to interact with them
* The type of object has to be first selected
* The list of records is provided as input
* A set of actions may be configured with record dependent menu contents & activation rules

![Record List](/media/RecordList.png)

Card Title & Icon are optional and configurable. List of fields displayed is configured via a FieldSet on the applicable object (the exact set of fields being automatically filtered according to FLS). 

The display of each record is configured via
* A display mode (tiles, table), as well as #columns and stacked display option when in table mode
* A Name field to be used as tile title
* A fieldset dev name listing the fields to be displayed as tile details

![Record List as Table](/media/RecordListTable.png)

Record List as Table

![Record List as Tiles](/media/RecordListTiles.png)

Record List as Tiles

The display of record actions is configured as
* a single list of menus & buttons with record dependent dynamic activation rules 
* triggering actions  for navigation, record data update or record manual edit (via popup)

![Record List](/media/RecordListActions.png)

For actions, dynamic conditions may be defined to activate them on a per record basis. For menus, options may be fixed or dynamic based on a record field.

```
[
  // Simple Button Case
  {
    "name": "open",
    "iconName": "utility:open", "variant": "brand",
    "action": {
      "type": "navigation",
      "params": {
        "type": "standard__recordPage",
        "attributes": {
          "recordId": "{{{Id}}}",
          "objectApiName": "{{{sobjectType}}}",
          "actionName": "view"
        }
  },
  // Simple Action Menu Case
  {
    "name": "select",
    "options": [ 
      {
        "label": "See Salesforce",  "name": "openSalesforce",
        "iconName": "utility:new_window",
        "action": {
          "type": "openURL",
          "params": {
            "url": "https://www.salesforce.com"
          }
        }
      },
      // Conditional Action 
      {
        "label":"Open Target", "name": "openTarget",
        "isDisabled": "{{{TECH_IsNotReady__c}}}",
        "iconName": "utility:call", "variant": "brand",
        "action": {
          "type": "navigation",
          "params": {
            "type": "standard__webPage",
            "attributes": {
              "url": "https://{{{TECH_TodoActionUrl__c}}}"
            }
          }
        }
      },
      // Direct current record Update action 
      {
        "label": "Set as SF", "name": "setSF",
        "iconName": "utility:constant",
        "action": {
          "type": "update",
          "params": {
            "Name": "Action on Salesforce",
            "TECH_TodoActionUrl__c": "salesforce.com"
          }
        }
      }
    ] 
  },
  // Dynamic Menu Case with current record update upon selection
  {
    "label": "Select",  "name": "targetSelect",
    "isDisabled": "{{{TECH_IsNotReady__c}}}",
    "iconName": "utility:picklist_type",
    "action": {
      "type": "update"
    },
    "options": "{{{TECH_AvailableTargets__c}}}"
  },
  // Standlone Edit button 
  {
    "label": "Edit",  "name": "recordEdit",
    "iconName": "utility:edit", "iconPosition": "right",
    "action": {
      "type": "edit",
      "params": {
        "header": "Please set values",
        "fields": [ {"name": "Name"},{"name": "TECH_TodoActionUrl__c"}]
      }
    }
  }
]
```

In this case the `TECH_AvailableTargets__c` field provides a dynamic list of possible values:
```
[
  {
    "label": "Salesforce",
    "value": {
      "Name": "Salesforce",
      "TECH_IsNotReady__c": false,
      "TECH_TodoActionUrl__c": "www.salesforce.com"
    }
  },
  {
    "label": "Google",
    "value": {
      "Name": "Google",
      "TECH_IsNotReady__c": true,
      "TECH_TodoActionUrl__c": "www.google.com"
    }
  }
]
```

__Note_: All ***navigation*** (and ***openURL***) actions trigger the opening of an external tab/page/popup 
(depending on the target) and modifications made there 



### Flow Embed

You may easily launch a Flow in the FlowEmbed component via an URL button on a record.

![Flow Embed](/media/FlowEmbed.png)

You just need to build a relative URL with
* The FlowEmbed URL root
* The devName of the Flow to execute
* A possible recordID to be provided as Flow input
* The Flow field providing the target record ID to be opened upon completion.
* The tab label

![Flow Embed Button](/media/FlowEmbedButton.png)

You may also also easily open this tab it from any custom lightning code leveraging the Aura navigation service.

```
let flow = component.get(“v.flow”);
let recordId = component.get(“v.recordId”);
let navService = component.find("navService"); 
let pageReference = {
  "type": "standard__webPage", 
  "attributes": {
    "url":
"/lightning/cmp/c__PEG_FlowEmbed_CMP?c__flow=" + flow + "&c__recordId=" + saveResult.recordId + "&c__target=targetId&c__label=MOC”
  }
};
navService.navigate(pageReference,false);
```

### Flow Invocable Actions

The Apex Actions are easily accessible from the App Builder
* Object Types need to be first defined for both input and output parameters
* Depending on the method, record or record lists as well as other text parameters need to be defined.

![Flow Actions](/media/FlowActions.png)

Flow Action Selection in Flow Builder

![Flow Actions Object Selection](/media/FlowActionsObject.png)

Flow "Object" Action Configuration in Flow Builder

![Flow Actions Get Duplicates](/media/FlowActionsGetDuplicates.png)

Flow "Get Duplicates" Action Configuration in Flow Builder

![Flow Actions Get Fieldset Data](/media/FlowActionsGetFieldsetData.png)

Flow "Get Fieldset Data" Action Configuration in Flow Builder

![Flow Actions Execute DML](/media/FlowActionsExecuteDML.png)

Flow "Execute DML" Action Configuration in Flow Builder