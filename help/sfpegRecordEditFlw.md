# ![Logo](/media/Logo.png) &nbsp; **sfpegRecordEditFlw** UI Flow Component

## Introduction

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
