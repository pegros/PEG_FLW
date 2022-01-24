---
# sfpegRecordEditFlw Component
---

## Introduction

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


---

## Component Configuration

### Global Layout

To be continued

### Flow Builder Configuration

To be continued

### Actions Configuration

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


---

## Configuration Examples

To be continued

---

## Technical Details

To be continued
