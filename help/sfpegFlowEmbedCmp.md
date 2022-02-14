---
# sfpegFlowEmbed_CMP Component
---

## Introduction

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