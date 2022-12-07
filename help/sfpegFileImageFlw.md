# ![Logo](/media/Logo.png) &nbsp; **sfpegFileImageCmp** UI Flow Component

## Introduction

The **sfpegFileImageCmp** component (found as **SF PEG Image File** in the Flow Builder)
enables to display easily an image, given its download URL. Leveraging sections it may
be used to display in a Flow page an image stored in a file linked to / referenced by a
record next to other informations, as displayed below.

![File Image](/media/FileImage.png)


---

## Component Configuration

### Global Layout

The component is vary basic and simply displays an `img` HTML tag with
* the configured file URL as `src` property
* the configured file name as `alt` property

This image is also included in a wrapping div the CSS of which my be 
customised via SLDS classes (e.g. to include padding, border...).

The width / height of the image depends on its own base size  and is scaled down according
to the width of the containing zone (which may be adapted when using sections in Flow builder).


### Flow Builder Configuration

In the Flow Builder, the component may be found under the **SF PEG Image File** name.

Ir offers 3 configuration input parameters:
* `wrapperCss` to customise the CSS to apply on the wrapping _div_
* `fileUrl` to provide the URL at which the image should be found, 
* `fileName` to provide an alternate name to the image

_Note_: Typically for a **contentDocument** record (i.e. a Salesforce **File**), the provided URL 
should be:
> https://_OrgRootURL_/sfc/servlet.shepherd/document/download/_ContentDocumentId_


---

## Configuration Examples

The snapshot below leverages the standard `CampaignImage` field on the Campaign object
and a formula to build the referenced image file download URL to display a graphical
presentation of a campaign record.

![File Image](/media/FileImage.png)


---

## Technical Details

This component is completely basic, with only HTML content, all the necessary information
coming from the input parameters provided by the Flow.