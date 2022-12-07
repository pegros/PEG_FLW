# ![Logo](/media/Logo.png) &nbsp; **sfpegRecordMergeFlw** UI Flow Component

## Introduction

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
