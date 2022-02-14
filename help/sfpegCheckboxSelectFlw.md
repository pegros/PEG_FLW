---
# sfpegCheckboxSelectCmp Component
---

## Introduction

The **sfpegCheckboxSelectFlw** component (found as **SF PEG Checkbox Multi-Selector** in the Flow Builder)
enables to select multiple items within a single record list via multiple checkbox groups.

![Checkbox Selector](/media/CheckboxSelect.png)

As a baseline, this component enables to simply select a set of record from a list provided as input.
* The type of object has to be first selected
* The list of records is provided as input
* 3 field API names have to be defined respectively to group the records in sections, define their
displayed labels and uniquely identify them
* The selected records are provided as output

No validation is enforced to check that a record is actually selected when the user clicks on “next”
This control must be done explicitly in the Flow.

---

## Component Configuration

### Global Layout

Records provided in the input list are grouped into multiple standard
**[lightning-checkbox-group](https://developer.salesforce.com/docs/component-library/bundle/lightning-checkbox-group/documentation)** components displayed within a standard
**[lightning-card](https://developer.salesforce.com/docs/component-library/bundle/lightning-card/documentation)** :
* the grouping (and group label) comes from the `sectionField` of each record
* the label of each checkbox item comes from the `labelField` of each record

The user may then simply select/unselect records by simply checking/unchecking each
displayed checkbox.

_Notes_:
* unicity of each record is ensured by relying on the `keyField` of each record (a same label
being therefore possibly used multiple times, preferrably in different sections)
* a preselection of records may be additionaly provided as input
* added / removed records to this list may be provided as output as well.
* the number of groups displayed per row is also configurable

### Flow Builder Configuration

In the Flow Builder, the component may be found under the **SF PEG Checkbox Multi-Selector** name.

An Object API Name must be set first in order to set the applicable context for the different input
and output lists:
* input:
    * `recordList` provides the list of records to choose from
    * `preselectionList` optionally provides an initial record preselection
* output:
    * `selectionList` provides the list of selected records
    * `addedList` provides the list of records which were added compared to the initial preselection
    * `removedList` provides the list of records which were removed compared to the initial preselection

Three field API names must be defined then for these records:
* `keyField` defines the field used to uniquely identify each record (`Id` by default)
* `labelField` defines the field value to display for each record (`Name` by default)
* `sectionField` defines the field used to group records into **checkbox-group** sections

Beware that the values for the 3 fields (`keyField`, `labelField` and `sectionField`) need to
be provided for each record provided in the `recordList` input.

Additionally, various paremeters mey be provided to tune the global display:
* `cardIcon` (see **[SLDS](https://www.lightningdesignsystem.com/icons/)** for available values)
and `cardTitle` to define the header of the containing **card**
* `cardClass` to provide a CSS class for the overall div container
* `columnNumber` to provide the number of sections per row (which should be a divider of 12)


---

## Configuration Examples

To be continued

---

## Technical Details

To be continued