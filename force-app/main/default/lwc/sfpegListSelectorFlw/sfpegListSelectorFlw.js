/***
* @author P-E GROS
* @date   Dec. 2020
* @description LWC Component for Flows enabling to display a set of records and select one of them.
*              Multiple display modes are available for the set of records to display from.
*              It is also possible to provide a first selected record at initialisation.
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

import LOCALE   from '@salesforce/i18n/locale';
import CURRENCY from '@salesforce/i18n/currency';
import NUMBER   from '@salesforce/i18n/number.numberFormat';
import PERCENT  from '@salesforce/i18n/number.percentFormat';

    // Internal constants
    const CURRENCY_FMT = new Intl.NumberFormat(LOCALE, {
        style: 'currency',
        currency: CURRENCY,
        currencyDisplay: 'symbol'
    });
    const PERCENT_FMT = new Intl.NumberFormat(LOCALE, {style:'percent'});
    const NUMBER_FMT = new Intl.NumberFormat(LOCALE,  {style:"decimal"});

export default class SfpegListSelectorFlw extends LightningElement {
    // Configuration fields
    @api cardTitle;                 // Title of the wrapping Card
    @api cardIcon;                  // Icon of the wrapping Card
    @api cardClass;                 // CSS Classes for the wrapping card div
    @api displayMode    = 'list';   // selected display mode (list, pills, tiles, table)
    @api tileSize       = 4;        // tile size (in tiles mode)
    @api nameField      = 'Name';   // API name of the field to be used as title for each record
    @api recordKey      = 'Id';     // Record single identification key (usually Salesforce Id)
    @api fieldSetName   = null;     // fieldset for additional info in tiles
    @api recordList;                // input record list to display
    @api selectedRecord = null;     // output selected record
    @api isDebug = false;           // Flag to display debug info.
    @api listHeight = 0;            // List DIV height (in pixels)

    // Internal fields
    @track displayItems = [] ;      // items used to display records.
    @track isReady = false;         // controls initialisation of the component.
    fieldSetDesc = [];              // fieldset description data fetched
    detailFieldsJson = [];          // list of detail fields.
    doSelectInit = false;           // flag to control the initialisation of the selected record display.

    // Display mode getters
    get isList() {
        if (this.isDebug) console.log('connectedCallback: isList', this.displayMode === 'list');
        return this.displayMode === 'list';
    }
    get isPills() {
        if (this.isDebug) console.log('connectedCallback: isPills', this.displayMode === 'pills');
        return this.displayMode === 'pills';
    }
    get isTiles() {
        if (this.isDebug) console.log('connectedCallback: isTiles', this.displayMode === 'tiles');
        return this.displayMode === 'tiles';
    }
    get isTable() {
        if (this.isDebug) console.log('connectedCallback: isTable', this.displayMode === 'table');
        return this.displayMode === 'table';
    }
    get listDivClass() {
        if (this.isDebug) console.log('connectedCallback: listDivClass', (this.listHeight == 0 ? '' :'slds-scrollable_y'));
        return "slds-card__body_inner slds-var-p-horizontal_medium " + (this.listHeight == 0 ? '' :'slds-scrollable_y');
    }
    get listDivStyle() {
        if (this.isDebug) console.log('connectedCallback: listDivStyle', (this.listHeight == 0 ? '' :'max-height:' + this.listHeight + 'px'));
        return (this.listHeight == 0 ? '' :'max-height:' + this.listHeight + 'px;');
    }

    // Display Data getters
    get selection() {
        if (this.selectedRecord) return this.selectedRecord[this.nameField];
        return 'None';
    }

    // FieldSet Desc Loading
    @wire(getFieldSetDesc, {"name":"$fieldSetName"})
    wiredFieldSet({ error, data }) {
        if (this.isDebug) console.log('wiredFieldSet: START');
        if (data) {
            if (this.isDebug) console.log('wiredFieldSet: data fetch OK', JSON.stringify(data));
            this.fieldSetDesc = data;
            this.displayItems = [];

            if (this.isDebug) console.log('wiredFieldSet: parsing fields desc ', JSON.stringify(data.fields));
            data.fields.forEach((item,idx) => {
                if (this.isDebug) console.log('wiredFieldSet: processing field ', item);
                this.detailFieldsJson.push(item);
            });
            if (this.isDebug) console.log('wiredFieldSet: nameField init ', this.nameField );
            if (this.isDebug) console.log('wiredFieldSet: detailFieldsJson init OK', JSON.stringify(this.detailFieldsJson));

            this.recordList.forEach(item => {
                if (this.isDebug) console.log('wiredFieldSet: processing item', JSON.stringify(item));
                let newItem = {
                    label: item[this.nameField],
                    //name: item.Id,
                    name: item[this.recordKey],
                    details: []
                };
                this.detailFieldsJson.forEach(field => {
                    if (this.isDebug) console.log('wiredFieldSet: adding detail field', field.name);
                    if (this.isDebug) console.log('wiredFieldSet: field type', field.type);

                    if(item[field.name]) {
                        switch (field.type) {
                            case 'BOOLEAN':
                                newItem.details.push({
                                    "label": field.label,
                                    "value": (item[field.name]?'☑︎':'☐')});
                                break;
                            case 'STRING':
                                newItem.details.push({
                                    "label": field.label,
                                    "value":item[field.name]});
                                break;
                            case 'DATE':
                            case 'DATETIME':
                                newItem.details.push({
                                    "label": field.label,
                                    "value": new Intl.DateTimeFormat(LOCALE).format(new Date(item[field.name]))});
                                break;
                            case 'CURRENCY':
                                newItem.details.push({
                                    "label": field.label,
                                    "value": CURRENCY_FMT.format(item[field.name])});
                                break;
                            case 'DOUBLE':
                            case 'INT':
                            case 'LONG':
                                newItem.details.push({
                                    "label": field.label,
                                    "value": NUMBER_FMT.format(item[field.name])});
                                break;
                            case 'PERCENT':
                                newItem.details.push({
                                    "label": field.label,
                                    "value": PERCENT_FMT.format(item[field.name]/100)});
                                break;
                            default:
                                newItem.details.push({
                                    "label": field.label,
                                    "value":'' + item[field.name]});
                        }
                    } 
                    else {
                        if (this.isDebug) console.log('wiredFieldSet: no value');
                    } 
                });
                if (this.isDebug) console.log('wiredFieldSet: newItem init', JSON.stringify(newItem));
                this.displayItems.push(newItem);
            });
            if (this.isDebug) console.log('wiredFieldSet: items init', JSON.stringify(this.displayItems));

            if (this.selectedRecord) {
                if (this.isDebug) console.log('wiredFieldSet: requesting record selection init for record ', JSON.stringify(this.selectedRecord));
                this.doSelectInit = true;
            }
            else {
                if (this.isDebug) console.log('wiredFieldSet: no initial record selection');
            }

            this.isReady = true;
        }
        else if (error) {
            console.warn('wiredFieldSet: data fetch KO', JSON.stringify(error));

            if (!this.fieldSetName) {
                if (this.isDebug) console.log('wiredFieldSet: no fieldSet to set');
                this.recordList.forEach(item => {
                    if (this.isDebug) console.log('wiredFieldSet: processing item', JSON.stringify(item));
                    let newItem = {
                        label: item[this.nameField],
                        //name: item.Id,
                        name: item[this.recordKey],
                        details: []
                    };
                    if (this.isDebug) console.log('wiredFieldSet: newItem init', JSON.stringify(newItem));
                    this.displayItems.push(newItem);
                });
                if (this.isDebug) console.log('wiredFieldSet: items init', JSON.stringify(this.displayItems));
            }
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
        /*if (this.isDebug) console.log('connectedCallback: displayMode', this.displayMode);
        if (this.isDebug) console.log('connectedCallback: nameField', this.nameField);
        if (this.isDebug) console.log('connectedCallback: fieldSetName', this.fieldSetName);
        if (this.isDebug) console.log('connectedCallback: recordList', JSON.stringify(this.recordList)); */                          
        if (this.isDebug) console.log('connectedCallback: END');
    }

    // Component Rendering Handling
    renderedCallback() {
        if (this.isDebug) console.log('renderedCallback: START');

        if (this.doSelectInit) {
            if (this.isDebug) console.log('renderedCallback: record selection to initialize');

            let liItems = this.template.querySelectorAll('.recordBox');
            if (this.isDebug) console.log('renderedCallback: liItems fetched',liItems);
            if (this.isDebug) console.log('renderedCallback: #liItems',liItems.length);

            //console.log('renderedCallback: selected record Id fetched ', this.selectedRecord.Id);
            if (this.isDebug) console.log('renderedCallback: selected record Id fetched ', (this.selectedRecord)[this.recordKey]);
            let selectedLi = null;
            liItems.forEach(item => {
                if (this.isDebug) console.log('renderedCallback: processing liItem',item.id);
                //console.log('renderedCallback: testing ',item.id.includes(this.selectedRecord.Id));
                //if (item.id.includes(this.selectedRecord.Id)) selectedLi = item;
                if (this.isDebug) console.log('renderedCallback: testing ',item.id.includes((this.selectedRecord)[this.recordKey]));
                if (item.id.includes((this.selectedRecord)[this.recordKey])) selectedLi = item;
            });
            if (this.isDebug) console.log('renderedCallback: selectedLi found',selectedLi);   
            if (selectedLi) selectedLi.classList.add("slds-theme_info");
            if (this.isDebug) console.log('renderedCallback: selectedLi updated',selectedLi);  

            this.doSelectInit = false;
        }
        else {
            if (this.isDebug) console.log('renderedCallback: no record selection to initialize');
        }

        if (this.isDebug) console.log('renderedCallback: END');
    }

    // User Interaction Handling
    handleSelection(event) {
        if (this.isDebug) console.log('handleSelection: START');
        /*console.log('handleSelection: event',event);
        console.log('handleSelection: source',JSON.stringify(event.srcElement));
        console.log('handleSelection: source title',JSON.stringify(event.srcElement.title));
        console.log('handleSelection: source id',JSON.stringify(event.srcElement.id));
        console.log('handleSelection: source name',JSON.stringify(event.srcElement.name));
        console.log('handleSelection: source value',JSON.stringify(event.srcElement.value));
        console.log('handleSelection: target ',event.currentTarget);
        console.log('handleSelection: target id',event.currentTarget.id);*/

        let selectId = event.currentTarget.id;
              
        if (selectId) {
            if (this.isDebug) console.log('handleSelection: processing event');
            event.preventDefault();
            event.stopPropagation();
            if (this.isDebug) console.log('handleSelection: propagation stopped');

            if (selectId.includes('-')) selectId = selectId.substring(0,selectId.indexOf('-'));
            if (this.isDebug) console.log('handleSelection: new selected ID',selectId);
            if (this.isDebug) console.log('handleSelection: current selected ID',JSON.stringify(this.selectedRecord));

            let liItems = this.template.querySelectorAll('.recordBox');
            if (this.isDebug) console.log('handleSelection: liItems fetched',liItems);
            if (this.isDebug) console.log('handleSelection: #liItems',liItems.length);

            // reset all tiles
            liItems.forEach(item => {
                if (this.isDebug) console.log('handleSelection: removing shade ',item.id);
                item.classList.remove("slds-theme_info");
            }); 
            console.log('handleSelection: liItems classes reset',liItems);

            // unselect current record or select new tile
            //if ((this.selectedRecord) && (this.selectedRecord.Id === selectId)) {
            if ((this.selectedRecord) && ((this.selectedRecord)[this.recordKey] === selectId)) {
                if (this.isDebug) console.log('handleSelection: unselecting record',selectId);         
                this.selectedRecord = null;
            }
            else {
                if (this.isDebug) console.log('handleSelection: selecting new record',selectId);         
                //this.selectedRecord = this.recordList.find(element => element.Id === selectId);
                this.selectedRecord = this.recordList.find(element => element[this.recordKey] === selectId);
                if (this.isDebug) console.log('handleSelection: selectedRecord updated',JSON.stringify(this.selectedRecord));          
                if (this.isDebug) console.log('handleSelection: looking for selectId',selectId);
                if (this.isDebug) console.log('handleSelection: among liItems',liItems.length);

                let selectedLi = null;
                liItems.forEach(item => {
                    if (this.isDebug) console.log('handleSelection: processing liItem',item.id);
                    if (this.isDebug) console.log('handleSelection: testing ',item.id.includes(selectId));
                    if (item.id.includes(selectId)) selectedLi = item;
                    //return item.id.includes(selectId);
                });
                if (this.isDebug) console.log('handleSelection: selectedLi found',selectedLi);   
                if (selectedLi) selectedLi.classList.add("slds-theme_info");
                if (this.isDebug) console.log('handleSelection: selectedLi updated',selectedLi);   
            }

            // triggering selection event
            let selectEvent = new CustomEvent('select', { "detail": this.selectedRecord });
            if (this.isDebug) console.log('handleSelection: selectEvent init',JSON.stringify(selectEvent));   
            this.dispatchEvent(selectEvent);
            if (this.isDebug) console.log('handleSelection: selectEvent dispatched');   
        }
        else {
            if (this.isDebug) console.log('handleSelection: ignoring event');
        } 
        
        if (this.isDebug) console.log('handleSelection: END');         
    }

    handleRemove(event) {
        if (this.isDebug) console.log('handleRemove: START');
        if (this.isDebug) console.log('handleRemove: event',event);
        if (this.isDebug) console.log('handleRemove: detail',JSON.stringify(event.detail));

        if (this.isDebug) console.log('handleRemove: item removed',event.detail.item.name);
        if (this.isDebug) console.log('handleRemove: index removed',event.detail.index);

        if (this.displayItems.length > 1) {
            this.displayItems.splice(event.detail.index,1);
            if (this.isDebug) console.log('handleRemove: displayItems updated',JSON.stringify(this.displayItems)); 
        }

        if (this.displayItems.length == 1) {
            //this.selectedRecord = this.recordList.find(element => element.Id === this.displayItems[0].name);
            this.selectedRecord = this.recordList.find(element => element[this.recordKey] === this.displayItems[0].name);
            if (this.isDebug) console.log('handleRemove: selection set',JSON.stringify(this.selectedRecord)); 
        }
        if (this.isDebug) console.log('handleRemove: END');
    }
}