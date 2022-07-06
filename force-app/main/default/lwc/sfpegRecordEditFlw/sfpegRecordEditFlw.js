/***
* @author P-E GROS
* @date   Dec. 2020
* @description LWC Component for Flows enabling to display an edit form for a record.
*              The content of this form relies on a Fieldset and there is no actual database
*              "save" triggered.
*              Setting the RecordType (if applicable) on the record is important
*              to properly display and interact with the fields.
*              A special flag enables to switch the semanctics of the "required?" flag on
*              fieldset fields into an "editable?" meaning.
*              For use in other custom components, it is also possible to enforce the
*              display of validate/cancel buttons and get notified (via validate/cancel
*              LWC custom events).
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

export default class SfpegRecordEditFlw extends LightningElement {
    // Configuration fields
    @api cardTitle;             // Title of the wrapping Card
    @api cardIcon;              // Icon of the wrapping Card
    @api tileSize = 4;          // tile size (in tiles mode)
    @api cardClass;             // CSS Classes for the wrapping card div
    @api fieldSetName = null;   // fieldset for additional info in tiles
    @api mainRecord = {};       // input record
    @api newRecord;             // output record
    @api cancelButton = null;   // Cancel Button label (no button displayed if null, used to trigger "cancel event" in non Flow use cases) 
    @api validateButton = null; // Validate Button label (no button displayed if null, used to trigger "validate event" in non Flow use cases) 
    
    @api isRW = false;          // Flag to alter the behaviour of the "required" flag of the fieldset items (if false, the standard "required" meaning is kept)
    @api isDebug = false;       // Flag to display debug info.

    /* OBSOLETE */
    //@api isEdit = false;        // Obsolete 

    // Internal fields
    @track recordFields = [] ;  // items used to display records.
    @track isReady = false;     // controls initialisation of the component.
    fieldSetDesc = [];          //fieldset desc received
    objectName = null;          //object API name
    objectRecordType = null;    //Record Type
    @track lastModif = null;         

    //Display mode getters
    get displayButtons() {
        let displayButton = !(this.cancelButton == null)|| !(this.validateButton == null);
        if (this.isDebug) console.log('displayButtons: ', displayButton);
        return displayButton;
    }
    get displayCancelButton() {
        let displayButton = !(this.cancelButton == null);
        if (this.isDebug) console.log('displayCancelButton: ', displayButton);
        return displayButton;
    }
    get displayValidateButton() {
        let displayButton = !(this.validateButton == null);
        if (this.isDebug) console.log('displayValidateButton: ', displayButton);
        return displayButton;
    }

    // FieldSet Desc Loading
    @wire(getFieldSetDesc, {"name":"$fieldSetName"})
    wiredFieldSet({ error, data }) {
        if (this.isDebug) console.log('wiredFieldSet: START');
        //console.log('wiredFieldSet: fieldList',this.fieldList);
        if (data) {
            if (this.isDebug) console.log('wiredFieldSet: data fetch OK', JSON.stringify(data));
            if (this.isDebug) console.log('wiredFieldSet: mainRecord is ', JSON.stringify(this.mainRecord));
            this.fieldSetDesc = data;
            this.recordFields = [];

            if (this.isDebug) console.log('wiredFieldSet: processing fields desc ', JSON.stringify(data.fields));
            data.fields.forEach((item,idx) => {
                if (this.isDebug) console.log('wiredFieldSet: processing field ', item.name);
                if (this.isDebug) console.log('wiredFieldSet: field details ', JSON.stringify(item));
                if (this.isDebug) console.log('wiredFieldSet: current value ', this.mainRecord[item.name]);

                this.recordFields.push({
                    desc : item,
                    mandatory : (this.isRW ? false : item.required),
                    readonly : (this.isRW ? !item.required : false),
                    value : this.mainRecord[item.name]
                });
            });
            if (this.isDebug) console.log('wiredFieldSet: recordFields init OK', JSON.stringify(this.recordFields));
            if (this.isDebug) console.log('wiredFieldSet: items init', JSON.stringify(this.displayItems));
            this.isReady = true;
        }
        else if (error) {
            if (this.isDebug) console.warn('wiredFieldSet: data fetch KO', JSON.stringify(error));
            this.isReady = true;
        }
        else {
            if (this.isDebug) console.log('wiredFieldSet: no feedback provided');
        }
        if (this.isDebug) console.log('wiredFieldSet: END NEW');
    }
    
    // Component Initialisation
    connectedCallback() {
        if (this.isDebug) console.log('connectedCallback: START');
        if (this.isDebug) console.log('connectedCallback: fieldSetName ', this.fieldSetName);
        if (this.fieldSetName) this.objectName = this.fieldSetName.substring(0,this.fieldSetName.indexOf('.'));
        if (this.isDebug) console.log('connectedCallback: objectName set ', this.objectName);

        if (this.isDebug) console.log('connectedCallback: mainRecord ', JSON.stringify(this.mainRecord));        
        this.newRecord = Object.assign({},this.mainRecord);
        if (this.isDebug) console.log('connectedCallback: newRecord init', JSON.stringify(this.newRecord));        

        this.objectRecordType = this.mainRecord['recordTypeId'] || this.mainRecord['RecordTypeId'];
        if (this.isDebug) console.log('connectedCallback: objectRecordType init', JSON.stringify(this.objectRecordType));    

        if (this.isDebug) console.log('connectedCallback: END');        
    }

    //Change tracking
    handleChange(event) {
        if (this.isDebug) console.log('handleChange: START');
        //if (this.isDebug) console.log('handleChange: event',event);
        if (this.isDebug) console.log('handleChange: event details ',JSON.stringify(event.detail));
        let fieldName = event.srcElement.fieldName;
        if (this.isDebug) console.log('handleChange: field',fieldName);
        //if (this.isDebug) console.log('handleChange: source element',event.srcElement);
        
        let newValue = event.detail.value || event.detail.checked;
        if (this.isDebug) console.log('handleChange: new value',JSON.stringify(newValue));
        // lookup field special case handling
        if (this.isDebug) console.log('handleChange: new value is Array',Array.isArray(newValue));
        newValue = Array.isArray(newValue) ? event.detail.value[0] : (event.detail.value || event.detail.checked);
        if (this.isDebug) console.log('handleChange: new value reviewed ',JSON.stringify(newValue));

        let oldValue = this.newRecord[fieldName];
        if (this.isDebug) console.log('handleChange: old value',JSON.stringify(oldValue));
        if (this.isDebug) console.log('handleChange: newRecord before change', JSON.stringify(this.newRecord));

        this.lastModif = fieldName + ' from ' + oldValue + ' to ' + newValue;
        if (this.isDebug) console.log('handleChange: lastModif tracked ', this.lastModif);

        this.newRecord[fieldName] = newValue;
        if (this.isDebug) console.log('handleChange: newRecord updated', this.newRecord[fieldName]);
        if (this.isDebug) console.log('handleChange: newRecord updated', JSON.stringify(this.newRecord));

        if (this.isDebug) console.log('handleChange: END');        
    }

    // Cancel/Validate Button event trigger logic
    handleValidate(event) {
        if (this.isDebug) console.log('handleValidate: START');

        // triggering selection event
        let validateEvent = new CustomEvent('validate', { "detail": this.newRecord });
        if (this.isDebug) console.log('handleValidate validateEvent init',JSON.stringify(validateEvent));   
        this.dispatchEvent(validateEvent);
        if (this.isDebug) console.log('handleValidate validateEvent dispatched');

        if (this.isDebug) console.log('handleValidate: END');   
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