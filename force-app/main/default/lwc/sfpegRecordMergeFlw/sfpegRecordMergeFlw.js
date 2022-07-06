/***
* @author P-E GROS
* @date   Dec. 2020
* @description LWC Component for Flows enabling to display an merge form for two records.
*              It basically outputs a clone of the main record with data selected from 
*              a second record or manually updated.
*              The set of displayed fields is configured via a Fieldset, but the main
*              (and initially cloned output) may contain other fields.
*              Setting the RecordType (if applicable) on the main record is important
*              to properly display and interact with the fields.
*              A few display variants are available to display field labels horizontaly
*              and show/hide a manual edit column.
*              For use in other custom components, it is also possible to enforce the
*              display of merge/cancel buttons and get notified (via merge/cancel
*              LWC custom events)
*
* Legal Notice
* 
* MIT License
* 
* Copyright (c) 2020 pegros
* 
* Permission is hereby granted, free of charge, to any person obtaining a copy
* of this software and associated documentation files (the "Software"), to deal
* in the Software without restriction, including without limitation the rights
* to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
* copies of the Software, and to permit persons to whom the Software is
* furnished to do so, subject to the following conditions:
* 
* The above copyright notice and this permission notice shall be included in all
* copies or substantial portions of the Software.
* 
* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
* IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
* FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
* AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
* LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
* OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
* SOFTWARE.
***/

import { LightningElement, wire , api, track} from 'lwc';
import getFieldSetDesc from '@salesforce/apex/sfpegGetFieldSet_CTL.getFieldSetDesc';

export default class SfpegRecordMergeFlw extends LightningElement {
    // Configuration fields
    @api cardTitle;         // Title of the wrapping Card
    @api cardIcon;          // Icon of the wrapping Card
    @api mainLabel;         // Header label of main record
    @api secondLabel;       // Header label of second record
    @api targetLabel;       // Header label of target record
    @api cardClass;         // CSS Classes for the wrapping card div

    @api fieldSetName = null;   // fieldset for additional info in tiles
    @api mainRecord;        // first input record
    @api secondRecord;      // second input record
    @api newRecord;         // output merged record

    @api hideTarget = false;    // Flag to hide target record (no edit possible).
    @api stackedLabels = false; // Flag to display field labels stacked (not in dedicated column)
    @api cancelButton = null;   // Cancel Button label (no button displayed if null, used to trigger "cancel event" in non Flow use cases) 
    @api mergeButton = null;    // Merge Button label (no button displayed if null, used to trigger "merge event" in non Flow use cases) 
    @api isDebug = false;       // Flag to display debug info.

    // Internal fields
    @track mainRecordFields = [] ;      // items used to display main record.
    @track secondRecordFields = [] ;    // items used to display second record.
    @track newRecordFields = [] ;       // items used to display target record.

    @track isReady = false;     // controls initialisation of the component.
    fieldSetDesc = [];          // fieldset desc received
    objectName = null;          // SObject API name
    objectRecordType = null;    // Record Type ofo the main record
    @track lastModif = null;    // for debug 
    toReset = false;            // flag to control height resizing           

    // Display mode getters
    get recordSize() {
        let size = (this.hideTarget ?  (this.stackedLabels ?  6 : 4) : (this.stackedLabels ?  4 : 3));
        if (this.isDebug) console.log('recordSize: ', size);
        return size;
    }
    get labelVariant() {
        let variant = (this.stackedLabels ?  'label-stacked' : 'label-hidden');
        //console.log('labelVariant: ', variant);
        return variant;
    }

    get displayButtons() {
        let displayButton = !(this.cancelButton == null)|| !(this.mergeButton == null);
        if (this.isDebug) console.log('displayButtons: ', displayButton);
        return displayButton;
    }
    get displayCancelButton() {
        let displayButton = !(this.cancelButton == null);
        if (this.isDebug) console.log('displayCancelButton: ', displayButton);
        return displayButton;
    }
    get displayMergeButton() {
        let displayButton = !(this.mergeButton == null);
        if (this.isDebug) console.log('displayMergeButton: ', displayButton);
        return displayButton;
    }
    
    get cardContentClass() {
        let contentClass = 'slds-card__body_inner slds-var-p-horizontal_medium '
                        + ((this.hideTarget && this.stackedLabels) ? ' slds-var-m-horizontal_medium' : '');
        if (this.isDebug) console.log('cardContentClass: ', contentClass);
        return contentClass;
    }
    get targetJson() {
        if (this.newRecord) return JSON.stringify(this.newRecord);
        return 'None';
    }
    get targetFieldsJson() {
        if (this.newRecordFields) return JSON.stringify(this.newRecordFields);
        return 'None';
    }
    

    // FieldSet Desc Loading
    @wire(getFieldSetDesc, {"name":"$fieldSetName"})
    wiredFieldSet({ error, data }) {
        if (this.isDebug) console.log('wiredFieldSet: START');
        //console.log('wiredFieldSet: fieldList',this.fieldList);
        if (data) {
            if (this.isDebug) console.log('wiredFieldSet: data fetch OK', JSON.stringify(data));
            if (this.isDebug) console.log('wiredFieldSet: mainRecord is ', JSON.stringify(this.mainRecord));
            if (this.isDebug) console.log('wiredFieldSet: secondRecord is ', JSON.stringify(this.secondRecord));
            if (this.isDebug) console.log('wiredFieldSet: newRecord is ', JSON.stringify(this.newRecord));
            this.fieldSetDesc = data;
            this.recordFields = [];

            if (this.isDebug) console.log('wiredFieldSet: processing fields desc ', JSON.stringify(data.fields));
            data.fields.forEach((item,idx) => {
                if (this.isDebug) console.log('wiredFieldSet: processing field ', item.name);
                if (this.isDebug) console.log('wiredFieldSet: field details ', JSON.stringify(item));
                if (this.isDebug) console.log('wiredFieldSet: current main value ', (this.mainRecord ? this.mainRecord[item.name] : null));
                if (this.isDebug) console.log('wiredFieldSet: current second value ', (this.secondRecord ? this.secondRecord[item.name] : null));
                if (this.isDebug) console.log('wiredFieldSet: current new value ', (this.newRecord ? this.newRecord[item.name] : null));

                this.mainRecordFields.push({
                    "desc" : item,
                    "value" : (this.mainRecord ? this.mainRecord[item.name] : null),
                    "class": "fieldSelect"
                });
                this.secondRecordFields.push({
                    "desc" : item,
                    "value" : (this.secondRecord ? this.secondRecord[item.name] : null),
                    "class": "fieldNoSelect"
                });
                this.newRecordFields.push({
                    "desc" : item,
                    "value" : (this.newRecord ? this.newRecord[item.name] : null),
                    "class": "fieldNoSelect"
                });
            });
            if (this.isDebug) console.log('wiredFieldSet: main recordFields init OK', JSON.stringify(this.mainRecordFields));
            if (this.isDebug) console.log('wiredFieldSet: second recordFields init OK', JSON.stringify(this.secondRecordFields));
            if (this.isDebug) console.log('wiredFieldSet: new recordFields init OK', JSON.stringify(this.newRecordFields));

            this.isReady = true;
        }
        else if (error) {
            console.warn('wiredFieldSet: data fetch KO', JSON.stringify(error));
            this.isReady = true;
        }
        else {
            if (this.isDebug) console.log('wiredFieldSet: no feedback provided');
        }
        if (this.isDebug) console.log('wiredFieldSet: END NEW');
    }

    // Component Initialisation
    connectedCallback() {
        if (this.isDebug) console.log('connected: START');
        if (this.isDebug) console.log('connected: fieldSetName ', this.fieldSetName);
        if (this.fieldSetName) this.objectName = this.fieldSetName.substring(0,this.fieldSetName.indexOf('.'));
        if (this.isDebug) console.log('connected: objectName set ', this.objectName);

        if (this.isDebug) console.log('connected: mainRecord ', JSON.stringify(this.mainRecord));        
        if (this.isDebug) console.log('connected: secondRecord ', JSON.stringify(this.secondRecord));        
        this.newRecord = Object.assign({},this.mainRecord);
        if (this.isDebug) console.log('connected: newRecord init', JSON.stringify(this.newRecord));        

        this.objectRecordType = (this.mainRecord ? this.mainRecord['recordTypeId'] || this.mainRecord['RecordTypeId'] : null);
        if (this.isDebug) console.log('connected: objectRecordType init', JSON.stringify(this.objectRecordType));    

        if (this.isDebug) console.log('connected: END');        
    }

    renderedCallback() {
        if (this.isDebug) console.log('rendered: START');

        /*
        let fieldDivs = this.template.querySelectorAll("div[data-type='field']");
        if (this.isDebug) console.log('rendered: fieldDivs querieds',fieldDivs);

        const resizeObserver = new ResizeObserver(changedDivs => {
            if (this.isDebug) console.log('resizeObserver: START with ',changedDivs);

            let divMap = {};
            fieldDivs.forEach(iterDiv => {
                if (this.isDebug) console.log('resizeObserver: processing iterDiv ',iterDiv);
                if (this.isDebug) console.log('resizeObserver: iter attributes ',JSON.stringify(iterDiv.dataset));
                let fieldName = iterDiv.dataset.name;
                if (this.isDebug) console.log('resizeObserver: fieldName  extracted ',fieldName);
                if (!divMap[fieldName]) divMap[fieldName] = [];
                divMap[fieldName].push(iterDiv);
            });
            if (this.isDebug) console.log('resizeObserver: divMap init ',divMap);

            for (let iterField in divMap) {
                if (this.isDebug) console.log('resizeObserver: processing iterField ',iterField);

                let iterFieldDivs = this.template.querySelectorAll("div[data-name='" + iterField + "']");
                if (this.isDebug) console.log('resizeObserver: iterFieldDivs fetched ',iterFieldDivs);

                let maxHeight = 0;
                iterFieldDivs.forEach(iterDiv => {
                    let divHeight = iterDiv.offsetHeight;
                    if (this.isDebug) console.log('resizeObserver: divHeight extracted ', divHeight);
                    if (this.isDebug) console.log('resizeObserver: clientHeight ', iterDiv.clientHeight);
                    maxHeight = Math.max(maxHeight,divHeight);
                });
                if (this.isDebug) console.log('resizeObserver: maxHeight determined ',maxHeight);

                iterFieldDivs.forEach(iterDiv => {
                    //if (this.isDebug) console.log('handleLoad: resetting iterDiv ',iterDiv);
                    iterDiv.style.height = maxHeight;
                });
                if (this.isDebug) console.log('handleLoad: iterField reset ',iterField);                
            }

            if (this.isDebug) console.log('resizeObserver: END');
        });
        if (this.isDebug) console.log('rendered: resizeObserver init ',resizeObserver);
      
        resizeObserver.observe(fieldDivs);
        if (this.isDebug) console.log('rendered: resizeObserver registered on fieldDivs');
        */

        if (this.isDebug) console.log('rendered: END');
    }

    //Change tracking
    handleChange(event) {
        if (this.isDebug) console.log('handleChange: START');
        if (this.isDebug) console.log('handleChange: event',event);
        let fieldName = event.srcElement.fieldName;
        if (this.isDebug) console.log('handleChange: field',fieldName);
        
        let newValue = event.detail.value;
        if (this.isDebug) console.log('handleChange: new value',JSON.stringify(newValue));
        // lookup field special case handling
        if (this.isDebug) console.log('handleChange: new value is Array',Array.isArray(newValue));
        newValue = Array.isArray(newValue) ? event.detail.value[0] : event.detail.value;
        if (this.isDebug) console.log('handleChange: new value reviewed ',JSON.stringify(newValue));

        let oldValue = this.newRecord[fieldName];
        if (this.isDebug) console.log('handleChange: old value',oldValue);

        let newField = this.newRecordFields.find(item => item.desc.name === fieldName);
        if (this.isDebug) console.log('handleChange: newField found',JSON.stringify(newField));
        newField.value = newValue || null;
        if (this.isDebug) console.log('handleChange: updated newRecordFields',JSON.stringify(this.newRecordFields));

        if (this.isDebug) console.log('handleChange: newRecord before change', JSON.stringify(this.newRecord));
        if (this.isDebug) console.log('handleChange: TRACK');

        let mainField = this.mainRecordFields.find(item => item.desc.name === fieldName);
        if (this.isDebug) console.log('handleChange: mainField found',JSON.stringify(mainField));
        mainField.class = "fieldNoSelect";
        if (this.isDebug) console.log('handleChange: mainRecordFields updated',JSON.stringify(this.mainRecordFields));

        let secondField = this.secondRecordFields.find(item => item.desc.name === fieldName);
        if (this.isDebug) console.log('handleChange: secondField found',JSON.stringify(secondField));
        secondField.class = "fieldNoSelect";
        if (this.isDebug) console.log('handleChange: secondRecordFields updated',JSON.stringify(this.secondRecordFields));

        this.lastModif = fieldName + ' from ' + oldValue + ' to ' + newValue;
        if (this.isDebug) console.log('handleChange: lastModif tracked ', this.lastModif);

        this.newRecord[fieldName] = newValue;
        if (this.isDebug) console.log('handleChange: newRecord updated', this.newRecord[fieldName]);
        if (this.isDebug) console.log('handleChange: newRecord updated', JSON.stringify(this.newRecord));

        if (this.isDebug) console.log('handleChange: END');        
    }

    handleSelect(event) {
        if (this.isDebug) console.log('handleSelect: START');
        if (this.isDebug) console.log('handleSelect: event',event);
        let recordName = event.srcElement.name || event.srcElement.value ;
        if (this.isDebug) console.log('handleSelect: record',recordName);

        //console.log('handleSelect: fieldSetDesc',JSON.stringify(this.fieldSetDesc));
        if (this.isDebug) console.log('handleSelect: initial newRecord',JSON.stringify(this.newRecord));
        if (this.isDebug) console.log('handleSelect: initial newRecordFields',JSON.stringify(this.newRecordFields));
        let selectedRecord      = (recordName === 'main' ? this.mainRecord : this.secondRecord);
        if (this.isDebug) console.log('handleSelect: target selectedRecord set',JSON.stringify(selectedRecord));
        
        this.newRecordFields.forEach(item => {
            if (this.isDebug) console.log('handleSelect: processing field ',item.desc.Name);
            item.value = selectedRecord[item.desc.name] || null;
            this.newRecord[item.desc.name] = item.value;
        });
        if (this.isDebug) console.log('handleSelect: newRecord updated ',JSON.stringify(this.newRecord));
        if (this.isDebug) console.log('handleSelect: newRecordFields updated ',JSON.stringify(this.newRecordFields));

        let inputfields = this.template.querySelectorAll('.targetEditField');
        if (inputfields) inputfields.forEach(item => {
            if (this.isDebug) console.log('handleSelect: processing inputField',item.fieldName);
            item.value = this.newRecord[item.fieldName];
        });
        if (this.isDebug) console.log('handleSelect: newRecord form refresh forced');

        let selectedFields      = (recordName === 'main' ? this.mainRecordFields : this.secondRecordFields);
        selectedFields.forEach(item => item.class="fieldSelect");
        if (this.isDebug) console.log('handleSelect: selectedFields reset ',JSON.stringify(selectedFields));
        let unselectedFields    = (recordName === 'main' ? this.secondRecordFields : this.mainRecordFields);
        unselectedFields.forEach(item => item.class="fieldNoSelect");
        if (this.isDebug) console.log('handleSelect: unselectedFields reset ',JSON.stringify(unselectedFields));

        if (this.isDebug) console.log('handleSelect: END');   
    }
    handleClickM(event) {
        if (this.isDebug) console.log('handleClickM: START');
        if (this.isDebug) console.log('handleClickM: event',event);
        event.preventDefault();
        event.stopPropagation();

        /*console.log('handleClickM: event srcElement ',event.srcElement);
        console.log('handleClickM: event src id',event.srcElement.id);
        console.log('handleClickM: event src name',event.srcElement.name);*/

        let fieldName = event.srcElement.name;
        if (this.isDebug) console.log('handleClickM: field',fieldName);
        let fieldValue = this.mainRecord[fieldName];
        if (this.isDebug) console.log('handleClickM: new value',fieldValue);

        if (this.isDebug) console.log('handleClickM: initial newRecord',JSON.stringify(this.newRecord));
        if (this.isDebug) console.log('handleClickM: initial newRecordFields',JSON.stringify(this.newRecordFields));

        this.newRecord[fieldName] = this.mainRecord[fieldName] || null;
        if (this.isDebug) console.log('handleClickM: updated newRecord',JSON.stringify(this.newRecord));

        let newField = this.newRecordFields.find(item => item.desc.name === fieldName);
        if (this.isDebug) console.log('handleClickM: newField found',JSON.stringify(newField));
        newField.value = this.mainRecord[fieldName] || null;
        if (this.isDebug) console.log('handleClickM: updated newRecordFields',JSON.stringify(this.newRecordFields));

        let inputfields = this.template.querySelectorAll('.targetEditField');
        if (inputfields) inputfields.forEach(item => {
            if (item.fieldName === fieldName) {
                if (this.isDebug) console.log('handleSelect: refreshing inputField',item.fieldName);
                item.value = this.newRecord[item.fieldName];
            }
        });
        if (this.isDebug) console.log('handleClickM: newRecord inputField refresh forced');

        let mainField = this.mainRecordFields.find(item => item.desc.name === fieldName);
        if (this.isDebug) console.log('handleClickM: mainField found',JSON.stringify(mainField));
        mainField.class = "fieldSelect";
        if (this.isDebug) console.log('handleClickM: mainRecordFields updated',JSON.stringify(this.mainRecordFields));

        let secondField = this.secondRecordFields.find(item => item.desc.name === fieldName);
        if (this.isDebug) console.log('handleClickM: secondField found',JSON.stringify(secondField));
        secondField.class = "fieldNoSelect";
        if (this.isDebug) console.log('handleClickM: secondRecordFields updated',JSON.stringify(this.secondRecordFields));

        this.lastModif = 'field ' + fieldName + ' reset from main record: ' + this.newRecord[fieldName];
        if (this.isDebug) console.log('handleClickM: last modif tracked ', this.lastModif);

        if (this.isDebug) console.log('handleClickM: END');
    }
    handleClickS(event) {
        if (this.isDebug) console.log('handleClickS: START');
        if (this.isDebug) console.log('handleClickS: event',event);
        event.preventDefault();
        event.stopPropagation();

        /*console.log('handleClickS: event srcElement ',event.srcElement);
        console.log('handleClickS: event src id',event.srcElement.id);
        console.log('handleClickS: event src name',event.srcElement.name);*/

        let fieldName = event.srcElement.name;
        if (this.isDebug) console.log('handleClickS: field',fieldName);
        let fieldValue = this.secondRecord[fieldName];
        if (this.isDebug) console.log('handleClickS: new value',fieldValue);

        if (this.isDebug) console.log('handleClickS: initial newRecord',JSON.stringify(this.newRecord));
        if (this.isDebug) console.log('handleClickS: initial newRecordFields',JSON.stringify(this.newRecordFields));

        this.newRecord[fieldName] = this.secondRecord[fieldName] || null;
        if (this.isDebug) console.log('handleClickS: updated newRecord',JSON.stringify(this.newRecord));

        let newField = this.newRecordFields.find(item => item.desc.name === fieldName);
        if (this.isDebug) console.log('handleClickS: newField found',JSON.stringify(newField));
        newField.value = this.secondRecord[fieldName] || null;
        if (this.isDebug) console.log('handleClickS: updated newRecordFields',JSON.stringify(this.newRecordFields));

        let inputfields = this.template.querySelectorAll('.targetEditField');
        if (inputfields) inputfields.forEach(item => {
            if (item.fieldName === fieldName) {
                if (this.isDebug) console.log('handleSelect: refreshing inputField',item.fieldName);
                item.value = this.newRecord[item.fieldName];
            }
        });
        if (this.isDebug) console.log('handleClickS: newRecord inputField refresh forced');

        let mainField = this.mainRecordFields.find(item => item.desc.name === fieldName);
        if (this.isDebug) console.log('handleClickS: mainField found',JSON.stringify(mainField));
        mainField.class = "fieldNoSelect";
        if (this.isDebug) console.log('handleClickS: mainRecordFields updated',JSON.stringify(this.mainRecordFields));

        let secondField = this.secondRecordFields.find(item => item.desc.name === fieldName);
        if (this.isDebug) console.log('handleClickS: secondField found',JSON.stringify(secondField));
        secondField.class = "fieldSelect";
        if (this.isDebug) console.log('handleClickS: secondRecordFields updated',JSON.stringify(this.secondRecordFields));

        this.lastModif = 'field ' + fieldName + ' reset from second record: ' + this.newRecord[fieldName];
        if (this.isDebug) console.log('handleClickS: last modif tracked ', this.lastModif);

        if (this.isDebug) console.log('handleClickS: END');   
    }

    handleLoad (event) {
        if (this.isDebug) console.log('handleLoad: START');

        if (this.toReset) {
            if (this.isDebug) console.log('handleLoad: resetting divs');

            // Awfull solution but coud not find a workaround to get the actual final heights
            // of input-field divs
            setTimeout(() => { 
                if (this.isDebug) console.log('handleLoad: wait done');

                let fieldDivs = this.template.querySelectorAll("div[data-type='field']");
                if (this.isDebug) console.log('handleLoad: fieldDivs queried ',fieldDivs);

                let fieldDivMap = {};
                let fieldHeightMap = {};
                fieldDivs.forEach(iterDiv => {
                    if (this.isDebug) console.log('handleLoad: processing iterDiv ',iterDiv);
                    if (this.isDebug) console.log('handleLoad: iter attributes ',JSON.stringify(iterDiv.dataset));
                    let fieldName = iterDiv.dataset.name;
                    if (this.isDebug) console.log('handleLoad: fieldName  extracted ',fieldName);
                    if (!fieldDivMap[fieldName]) fieldDivMap[fieldName] = [];
                    fieldDivMap[fieldName].push(iterDiv);

                    if (!fieldHeightMap[fieldName]) fieldHeightMap[fieldName] = 0;
                    let divHeight = iterDiv.clientHeight;
                    if (this.isDebug) console.log('handleLoad: divHeight extracted ',divHeight);
                    if (this.isDebug) console.log('handleLoad: offsetHeight ',iterDiv.offsetHeight);
                    fieldHeightMap[fieldName] = Math.max(fieldHeightMap[fieldName],divHeight);
                });
                if (this.isDebug) console.log('handleLoad: fieldDivMap init ',JSON.stringify(fieldDivMap));
                if (this.isDebug) console.log('handleLoad: fieldHeightMap init ',JSON.stringify(fieldHeightMap));

                for (let iterField in fieldDivMap) {
                    if (this.isDebug) console.log('handleLoad: processing iterField ',iterField);
                    let divHeight = fieldHeightMap[iterField];
                    if (this.isDebug) console.log('handleLoad: divHeight fetched ',divHeight);

                    fieldDivMap[iterField].forEach(iterDiv => {
                        if (this.isDebug) console.log('handleLoad: resetting iterDiv ',iterDiv.id);
                        //if (this.isDebug) console.log('handleLoad: previous height ',iterDiv.style.height);
                        //iterDiv.style.height = '' + divHeight + 'px';
                        if (this.isDebug) console.log('handleLoad: previous minHeight ',iterDiv.style.minHeight);
                        iterDiv.style.minHeight = '' + divHeight + 'px';
                    });
                    if (this.isDebug) console.log('handleLoad: iterField reset ',iterField);
                } 
                this.toReset = false;
                if (this.isDebug) console.log('handleLoad: END');
            }, 300);
            //let allNoSelect = this.template.querySelectorAll(".fieldNoSelect");
            //if (this.isDebug) console.log('handleLoad: allNoSelect querieds',allNoSelect);
            if (this.isDebug) console.log('handleLoad: waiting for input fields finalization');
        }
        else {
            if (this.isDebug) console.log('handleLoad: activating div reset');
            this.toReset = true;
            if (this.isDebug) console.log('handleLoad: END');
        }
    }

    // Cancel/Merge Button event trigger logic
    handleMerge(event) {
        if (this.isDebug) console.log('handleMerge: START');

        // triggering selection event
        let mergeEvent = new CustomEvent('merge', { "detail": this.newRecord });
        if (this.isDebug) console.log('handleMerge mergeEvent init',JSON.stringify(mergeEvent));   
        this.dispatchEvent(mergeEvent);
        if (this.isDebug) console.log('handleSelection mergeEvent dispatched');

        if (this.isDebug) console.log('handleMerge: END');   
    }
    handleCancel(event) {
        if (this.isDebug) console.log('handleCancel: START');

        // triggering selection event
        let cancelEvent = new CustomEvent('cancel', null);
        if (this.isDebug) console.log('handleCancel cancelEvent init',JSON.stringify(cancelEvent));   
        this.dispatchEvent(cancelEvent);
        if (this.isDebug) console.log('handleCancel cancelEvent dispatched');

        if (this.isDebug) console.log('handleCancel: END');   
    }

}