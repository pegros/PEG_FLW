---
# Flow Apex Actions
---

## Introduction

The Apex Actions are easily accessible from the Flow Builder
* Object Types need to be first defined for both input and output parameters
* Depending on the method, record or record lists as well as other text parameters need to be defined.

![Flow Actions](/media/FlowActions.png)

_Flow Action Selection in Flow Builder_

![Flow Actions Object Selection](/media/FlowActionsObject.png)

_Flow "Object" Action Configuration in Flow Builder_


## Configuration

### **getDuplicates** Action

It enables to evaluate duplicate rules on a record.

![Flow Actions Get Duplicates](/media/FlowActionsGetDuplicates.png)

_Flow "Get Duplicates" Action Configuration in Flow Builder_


### **getFieldSetData** Action

It enables to enrich a list of records with values for all fields of a fieldset
(enables to enrich results returned by the **getDuplicates** action)

![Flow Actions Get Fieldset Data](/media/FlowActionsGetFieldsetData.png)

_Flow "Get Fieldset Data" Action Configuration in Flow Builder_


### **executeDML** Action

It to execute a DML (create/update) while bypassing warning level
duplicate rules

![Flow Actions Execute DML](/media/FlowActionsExecuteDML.png)

_Flow "Execute DML" Action Configuration in Flow Builder_
