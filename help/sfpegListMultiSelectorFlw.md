---
# sfpegListMultiSelectorFlw Component
---

## Introduction

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