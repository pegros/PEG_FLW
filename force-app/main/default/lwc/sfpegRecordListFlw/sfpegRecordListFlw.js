/***
* @author P-E GROS
* @date   Mar. 2021
* @descriptio   LWC Component for Flows enabling to display a set of records and execute
*               various actions out of them (edit, navigation...).
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
import { NavigationMixin } from 'lightning/navigation';

import LOCALE       from '@salesforce/i18n/locale';
import CURRENCY     from '@salesforce/i18n/currency';
import NUMBER       from '@salesforce/i18n/number.numberFormat';
import PERCENT      from '@salesforce/i18n/number.percentFormat';
import SAVE_LABEL   from '@salesforce/label/c.sfpegRecordListSaveLabel';
import CANCEL_LABEL from '@salesforce/label/c.sfpegRecordListCancelLabel';

    // Internal constants
    const CURRENCY_FMT = new Intl.NumberFormat(LOCALE, {
        style: 'currency',
        currency: CURRENCY,
        currencyDisplay: 'symbol'
    });
    const PERCENT_FMT = new Intl.NumberFormat(LOCALE, {style:'percent'});
    const NUMBER_FMT = new Intl.NumberFormat(LOCALE,  {style:"decimal"});

export default class SfpegRecordListFlw extends NavigationMixin(LightningElement) {

    // Configuration fields - Main Container Display
    @api cardTitle;                 // Title of the wrapping Card
    @api cardIcon;                  // Icon of the wrapping Card
    @api cardClass;                 // CSS Classes for the wrapping card div
    @api displayMode    = 'tiles';  // selected display mode (list, tiles, table)
    @api tileSize       = 4;        // tile size (in tiles or table mode)
    @api listHeight     = 0         // Height (in px) of the record list display area (0 : no scroll)
    @api tableColumns   = 1         // Number of columns when in table display 
    @api stackedDisplay = false;    // Display field labels in stacked mode when in table display 

    // Configuration fields - Selection Record List 
    @api nameField      = 'Name';   // API name of the field to be used as title for each record
    @api fieldSetName   = null;     // fieldset for additional info in tiles
    @api recordList     = [];       // input record list to display
    @api outputList     = [];       // output possibly updated record list
    @api actionListStr  = '';       // configuration of the actions to display per record (as a stringified JSON list)

    // Configuration fields - Options selection
    @api isDebug = false;           // Flag to display debug info.

    // Internal fields 
    @track isReady          = false;    // controls initialisation of the component.
    @track displayItems     = [];       // Display Items corresponding to recordList.
    fieldSetDesc            = [];       // fieldset description data fetched
    detailFieldsJson        = [];       // list of detail fields.
    actionListJson          = [];       // JSON parsing of actionListStr string parameter.
    sobjectName             = null;     // Object API Name of the records.
    saveLabel               = SAVE_LABEL;   // Save Button label for the edit modal popup
    cancelLabel             = CANCEL_LABEL; // Cancel Button label for the edit modal popup

    // Modal Display
    @track showModal        = false;    // Flag to control teh display of the modal popup for edit action
    modalHeader             = '';       // Modal header displayed
    modalDisplayItem        = {};       // Display Item for the popup edit form
    modalFields             = [];       // List of fields for the popup edit form

    // Display mode getters
    get isTiles() {
        //console.log('connectedCallback: isTiles --> ', this.displayMode === 'tiles');
        return this.displayMode === 'tiles';
    }
    get isTable() {
        let decision = ((this.displayMode === 'table') && (this.tableColumns == 1) && (!this.stackedDisplay));
        //console.log('connectedCallback: isTable --> ', decision);
        return decision;
    }
    get showActions() {
        //console.log('connectedCallback: showActions --> actionListStr ', this.actionListStr);
        //console.log('connectedCallback: showActions --> actionListJson ', this.actionListJson);
        let showAction = ((this.actionListJson) && (this.actionListJson.length > 0));
        //console.log('connectedCallback: showActions --> ', showAction);
        return showAction;
    }
    get detailClass() {
        let detailClass = "slds-media slds-var-m-bottom_xx-small"  
                    + (((this.actionListJson) && (this.actionListJson.length > 0)) ? ' slds-var-m-top_x-small' : ' slds-var-m-top_xx-small');
        //console.log('connectedCallback: detailClass --> ',detailClass);
        return detailClass;
    }
    get isTableMulti() {
        let decision = ((this.displayMode === 'table') && ((this.tableColumns > 1) || (this.stackedDisplay)));
        //console.log('connectedCallback: isTableMulti --> ', decision);
        return decision;
    }
    get tableFieldClass() {
        // slds-form-element_readonly
        let detailClass = "slds-col slds-form-element slds-size_1-of-" + this.tableColumns
                        + (this.stackedDisplay ? " slds-form-element_stacked" : " horizontalField slds-form-element_horizontal");
        //console.log('connectedCallback: tableFieldClass --> detailClass',detailClass);
        return detailClass;
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
            data.fields.forEach(eachField => {
                if (this.isDebug) console.log('wiredFieldSet: processing field ', eachField);
                (this.detailFieldsJson).push(eachField);
            });
            if (this.isDebug) console.log('wiredFieldSet: nameField init ', this.nameField );
            if (this.isDebug) console.log('wiredFieldSet: detailFieldsJson init OK', JSON.stringify(this.detailFieldsJson));

            let index = 0;
            this.outputList.forEach(eachRecord => {
                if (this.isDebug) console.log('wiredFieldSet: processing record ', JSON.stringify(eachRecord));

                let newItem = {
                    'index': index++,
                    'label': eachRecord[this.nameField],
                    'class': 'slds-box slds-box_x-small slds-var-m-around_xx-small slds-theme_default',
                    'details': [],
                    'value': eachRecord,
                    'actions': this.formatActions(this.actionListJson,eachRecord)
                };
                this.detailFieldsJson.forEach(eachField => {
                    //console.log('wiredFieldSet: adding detail field', eachField.name);
                    //console.log('wiredFieldSet: field type', eachField.type);
                    if(eachRecord[eachField.name]) {
                        newItem.details.push({
                            "label": eachField.label,
                            "name":eachField.name,
                            "value": this.formatField(eachRecord[eachField.name],eachField)
                        });
                    } 
                    else {
                        if (this.isDebug) console.log('wiredFieldSet: no value');
                    } 
                });
                if (this.isDebug) console.log('wiredFieldSet: newItem init', JSON.stringify(newItem));
                this.displayItems.push(newItem);
                //this.searchItems.push(newItem);
            });
            if (this.isDebug) console.log('wiredFieldSet: display items init', JSON.stringify(this.displayItems));

            this.isReady = true;
        }
        else if (error) {
            console.warn('wiredFieldSet: data fetch KO', JSON.stringify(error));

            if (!this.fieldSetName) {
                if (this.isDebug) console.log('wiredFieldSet: no fieldSet to set');

                this.recordList.forEach(eachRecord => {
                    if (this.isDebug) console.log('wiredFieldSet: processing record ', JSON.stringify(eachRecord));

                    let newItem = {
                        'index': index++,
                        'label': eachRecord[this.nameField],
                        'class': 'slds-box slds-box_x-small slds-var-m-around_xx-small slds-theme_default',
                        'details': [],
                        'value':eachRecord,
                        'actions': this.formatActions(this.actionListJson,eachRecord)
                    };
                    if (this.isDebug) console.log('wiredFieldSet: newItem init', JSON.stringify(newItem));
                    this.displayItems.push(newItem);
                });
                if (this.isDebug) console.log('wiredFieldSet: items init', JSON.stringify(this.displayItems));
            }
            this.isReady = true;
        }
        else {
            console.warn('wiredFieldSet: no feedback provided');
        }
        if (this.isDebug) console.log('wiredFieldSet: END NEW');
    }

    // Component Initialisation
    connectedCallback() {
        if (this.isDebug) console.log('connectedCallback: START');

        this.sobjectName = this.fieldSetName.split('.')[0];
        if (this.isDebug) console.log('connectedCallback: sobjectName init ', this.sobjectName);

        /*console.log('connectedCallback: displayMode fetched ', this.displayMode);
        console.log('connectedCallback: nameField fetched ', this.nameField);
        console.log('connectedCallback: fieldSetName fetched ', this.fieldSetName);*/
        if (this.isDebug) console.log('connectedCallback: recordList fetched ', JSON.stringify(this.recordList));

        this.outputList = this.recordList.map(record => Object.assign({}, record));
        if (this.isDebug) console.log('connectedCallback: outputList cloned ', JSON.stringify(this.outputList));

        console.log('connectedCallback: actionListStr fetched ', this.actionListStr);  
        if ((this.actionListStr) && (this.actionListStr.length > 0)) {
            let actionListJson = JSON.parse(this.actionListStr);
            actionListJson.forEach(item => {
                if (this.isDebug) console.log('connectedCallback: processing action item ', JSON.stringify(item));  
                item.isMenu = (item.options != null);
                item.hasLabel = (item.label != null);
                item.hasIcon = (item.iconName != null);

                if (item.options) {
                    if (this.isDebug) console.log('connectedCallback: handling options list');  
                    if (typeof item.options === "string") {
                        if (this.isDebug) console.log('connectedCallback: handling contextual options list');  
                        let tokens = this.parseString(item.options);
                        if (tokens.length == 1) {
                            item.evalOptions = true;
                            item.optionsField = tokens[0].field;
                        }
                        else {
                            console.warn('connectedCallback: parsing issue with contextual options list', item.options);  
                        }
                    }
                    else {
                        if (this.isDebug) console.log('connectedCallback: handling disabled flag of options list');  
                        item.options.forEach(option => {
                            if (this.isDebug) console.log('connectedCallback: processing option ', option);  
                            if ((option.isDisabled) && (typeof option.isDisabled === "string")) {
                                let tokens = this.parseString(option.isDisabled);
                                if (tokens.length > 0 ) {
                                    option.evalDisabled = true;
                                    option.disabledTokens = tokens;
                                }
                                else {
                                    console.warn('connectedCallback: parsing issue with disabled option ', option.isDisabled);  
                                }
                            }
                        });
                    }
                }

                if ((item.isDisabled) && (typeof item.isDisabled === "string")) {
                    let tokens = this.parseString(item.isDisabled);
                    if (tokens.length >0 ) {
                        item.evalDisabled = true;
                        item.disabledTokens = tokens;
                    }
                    else {
                        console.warn('connectedCallback: parsing issue with disabled item ', item.isDisabled);  
                    }
                }
            });
            if (this.isDebug) console.log('connectedCallback: items updated ', JSON.stringify(actionListJson));  
            this.actionListJson = actionListJson;
            if (this.isDebug) console.log('connectedCallback: actionListJson parsed ', JSON.stringify(this.actionListJson));  
        }
        else {
            if (this.isDebug) console.log('connectedCallback: no action to parse');  
        }

        if (this.isDebug) console.log('connectedCallback: END');
    }

    // Component Rendering Handling
    renderedCallback() {
        if (this.isDebug) console.log('renderedCallback: START');
        if (this.isDebug) console.log('renderedCallback: END');
    }

    // Component Actions Handling
    onButtonClick(event){
        if (this.isDebug) console.log('onButtonClick: START');
        /*console.log('onButtonClick: event',event);
        console.log('onButtonClick: event target',event.target);
        console.log('onButtonClick: event source',event.srcElement);

        console.log('onButtonClick: event target label',event.target.label);
        console.log('onButtonClick: event target title',event.target.title);
        console.log('onButtonClick: event target name',event.target.name);
        console.log('onButtonClick: event target ',JSON.stringify(event.target));*/
        if (this.isDebug) console.log('onButtonClick: event target value',JSON.stringify(event.target.value));

        let selectedIndex = event.target.value.index;
        if (this.isDebug) console.log('onButtonClick: selectedIndex ', selectedIndex);

        let selectedRecord = event.target.value;
        //let selectedRecord = this.outputList[selectedIndex];
        if (this.isDebug) console.log('onButtonClick: record context fetched ',JSON.stringify(selectedRecord));
        let selectedActionName = event.target.name;
        if (this.isDebug) console.log('onButtonClick: action name fetched ',selectedActionName);
        let selectedAction = this.actionListJson.find(action => action.name === selectedActionName);
        if (this.isDebug) console.log('onButtonClick: action config found ',JSON.stringify(selectedAction));

        if ((selectedRecord) && (selectedAction) && (selectedAction.action)) {
            if (this.isDebug) console.log('onButtonClick: triggering action ',selectedAction.action);
            this.processAction(selectedAction.action,selectedRecord);
        }
        else {
            console.warn('onButtonClick: missing record/action context to triogger action');
        }

        if (this.isDebug) console.log('onButtonClick: END');
    }

    onMenuSelect(event){
        if (this.isDebug) console.log('onMenuSelect: START');
        /*console.log('onMenuSelect: event',event);
        console.log('onMenuSelect: event target',event.target);
        console.log('onMenuSelect: event source',event.srcElement);

        console.log('onMenuSelect: event target label',event.target.label);
        console.log('onMenuSelect: event target title',event.target.title);
        console.log('onMenuSelect: event target name',event.target.name);
        console.log('onMenuSelect: event target value',JSON.stringify(event.target.value));
        console.log('onMenuSelect: event target ',JSON.stringify(event.target));

        console.log('onMenuSelect: event detail label',event.detail.label);
        console.log('onMenuSelect: event detail title',event.detail.title);
        console.log('onMenuSelect: event detail value',JSON.stringify(event.detail.value));
        console.log('onMenuSelect: event target ',JSON.stringify(event.detail));*/

        if (this.isDebug) console.log('onMenuSelect: event target value',JSON.stringify(event.target.value));

        let selectedIndex = event.target.value.index;
        if (this.isDebug) console.log('onMenuSelect: selectedIndex ', selectedIndex);

        //let selectedRecord = this.outputList[selectedIndex];
        let selectedRecord = event.target.value;
        if (this.isDebug) console.log('onMenuSelect: record context fetched ',JSON.stringify(selectedRecord));
        let selectedMenuName = event.target.name;
        if (this.isDebug) console.log('onMenuSelect: menu name fetched ',selectedMenuName);
        let selectedMenu = this.actionListJson.find(action => action.name === selectedMenuName);
        if (this.isDebug) console.log('onMenuSelect: menu config found ',JSON.stringify(selectedMenu));

        let selectedOption = event.detail.value;
        if (this.isDebug) console.log('onMenuSelect: menu option fetched ',JSON.stringify(selectedOption));

        if ((selectedRecord) && (selectedMenu) && (selectedOption)) {
            if (selectedMenu.action) {
                if (this.isDebug) console.log('onMenuSelect: triggering menu action ',selectedMenu.action);
                if (this.isDebug) console.log('onMenuSelect: with option value ',selectedOption.value);
                this.processAction(selectedMenu.action,selectedRecord,selectedOption.value);
            }
            else if (selectedOption.action) {
                if (this.isDebug) console.log('onMenuSelect: triggering menu option action ',selectedOption.action);
                this.processAction(selectedOption.action,selectedRecord);
            }
            else {
                console.warn('onMenuSelect: no action available on menu & option');
            }
        }
        else {
            console.warn('onMenuSelect: missing record/action context to trigger action');
        }

        if (this.isDebug) console.log('onMenuSelect: END');
    }

    onModalLoad(event) {
        if (this.isDebug) console.log('onModalLoad: START');
        if (this.isDebug) console.log('onModalLoad: END');
    }

    onModalFieldChange(event) {
        if (this.isDebug) console.log('onModalFieldChange: START');

        let fieldName = event.srcElement.fieldName;
        if (this.isDebug) console.log('onModalFieldChange: field',fieldName);
        
        let newValue = event.detail.value;
        //console.log('onModalFieldChange: new value',JSON.stringify(newValue));
        // lookup field special case handling
        //console.log('onModalFieldChange: new value is Array',Array.isArray(newValue));
        newValue = Array.isArray(newValue) ? event.detail.value[0] : event.detail.value;
        if (this.isDebug) console.log('onModalFieldChange: new value reviewed ',JSON.stringify(newValue));

        let fieldDesc = this.modalFields.find(item => item.name === fieldName);
        if (this.isDebug) console.log('onModalFieldChange: fieldDesc found',JSON.stringify(fieldDesc));

        fieldDesc.value = newValue;
        if (this.isDebug) console.log('onModalFieldChange: fieldDesc updated', JSON.stringify(fieldDesc));

        if (this.isDebug) console.log('onModalFieldChange: END');
    }

    onModalSave(event) {
        if (this.isDebug) console.log('onModalSave: START');
        if (this.isDebug) console.log('onModalSave: event',event);
        if (this.isDebug) console.log('onModalSave: event target',event.target);
        if (this.isDebug) console.log('onModalSave: event source',event.srcElement);

        event.preventDefault();

        if (this.isDebug) console.log('onModalSave: modalFields fetched',JSON.stringify(this.modalFields));
        let fieldUpdates = {};
        this.modalFields.forEach(item => {
            fieldUpdates[item.name] = item.value;
        });
        if (this.isDebug) console.log('onModalSave: fieldUpdates init ',JSON.stringify(fieldUpdates));

        this.updateRecord(this.modalDisplayItem,fieldUpdates);
        if (this.isDebug) console.log('onModalSave: record updated');
        //console.log('onModalSave: display items updated ',JSON.stringify(this.displayItems));
        //console.log('onModalSave: ouputlist fetched ',JSON.stringify(this.outputList));

        this.showModal = false;
        this.modalHeader = '';
        this.modalDisplayItem = {};
        this.modalFields = [];

        if (this.isDebug) console.log('onModalSave: END');
    }

    onModalCancel(event) {
        if (this.isDebug) console.log('onModalCancel: START');
        /*console.log('onMenuSelect: event',event);
        console.log('onMenuSelect: event target',event.target);
        console.log('onMenuSelect: event source',event.srcElement);*/
        
        this.showModal = false;
        this.modalHeader = '';
        this.modalDisplayItem = {};
        this.modalFields = [];

        if (this.isDebug) console.log('onModalCancel: END');
    }

    // Action Utilities
    processAction = function(action,context,option) {
        if (this.isDebug) console.log('processAction: START');

        if (action) {
            switch (action.type) {
                case 'navigation':
                    if (this.isDebug) console.log('processAction: processing navigation action');
                    let pageRefStr = JSON.stringify(action.params);
                    this.triggerNavigate(pageRefStr,context.value);
                    break;
                case 'openURL':
                    if (this.isDebug) console.log('processAction: processing openURL action');
                    let targetUrl = action.params.url;
                    this.triggerOpenURL(targetUrl,context.value);
                    break;
                case 'update':
                    if (this.isDebug) console.log('processAction: processing record update action');
                    this.updateRecord(context,option || action.params);
                    break;
                case 'edit':
                    if (this.isDebug) console.log('processAction: processing record edit action');
                    this.editRecord(context,action.params);
                    break;
                default:
                    console.warn('processAction: no action type provided',action.action.type);
            }
            if (this.isDebug) console.log('processAction: action triggered');

            if (action.next) {
                if (this.isDebug) console.log('processAction: chained action to trigger',JSON.stringify(action.next));
                this.processAction(action.next,context,option);
                if (this.isDebug) console.log('processAction: chained action triggered');
            }
            else {
                if (this.isDebug) console.log('processAction: no chained action to trigger');
            }

            let actionEvent = new CustomEvent('actionTriggered', {
                "detail": {
                    "action":action,
                    "record": context.value,
                    "list": this.outputList
                }
            });
            if (this.isDebug) console.log('processAction: event init',JSON.stringify(actionEvent));   
            this.dispatchEvent(actionEvent);
            if (this.isDebug) console.log('processAction: actionEvent dispatched'); 
        }
        else {
            console.warn('processAction: no action provided');
        }

        if (this.isDebug) console.log('processAction: END');
    }

    triggerNavigate = function(pageRefStr,context) {
        if (this.isDebug) console.log('triggerNavigate: START');
        if (this.isDebug) console.log('triggerNavigate: context ', JSON.stringify(context));
        if (this.isDebug) console.log('triggerNavigate: pageRef ', pageRefStr);
        if (pageRefStr.includes('{{{')) {
            if (this.isDebug) console.log('triggerNavigate: merging context data ', context);

            let tokens = this.parseString(pageRefStr);
            if (this.isDebug) console.log('triggerNavigate: tokens parsed',tokens);

            pageRefStr = this.mergeString(pageRefStr,tokens,context);
            if (this.isDebug) console.log('triggerNavigate: pageRefStr merged',pageRefStr);
        }
        else {
            if (this.isDebug) console.log('triggerNavigate: no merge required');
        }

        let pageRef = JSON.parse(pageRefStr);
        if (this.isDebug) console.log('triggerNavigate: pageRef parsed ',pageRef);

        this[NavigationMixin.GenerateUrl](pageRef).then(url => {
            if (this.isDebug) console.log('triggerNavigate: url generated ',url);
        });

        this[NavigationMixin.Navigate](pageRef);
        if (this.isDebug) console.log('triggerNavigate: END');
    }

    triggerOpenURL = function(urlStr,context) {
        if (this.isDebug) console.log('triggerOpenURL: START');
        if (this.isDebug) console.log('triggerOpenURL: context ', JSON.stringify(context));
        if (this.isDebug) console.log('triggerOpenURL: urlStr ', urlStr);
        if (urlStr.includes('{{{')) {
            if (this.isDebug) console.log('triggerOpenURL: merging context data ', context);

            let tokens = this.parseString(urlStr);
            if (this.isDebug) console.log('triggerOpenURL: tokens parsed',tokens);

            urlStr = this.mergeString(urlStr,tokens,context);
            if (this.isDebug) console.log('triggerOpenURL: urlStr merged',urlStr);
        }
        else {
            if (this.isDebug) console.log('triggerOpenURL: no merge required');
        }

        window.open(urlStr,'_blank');
        if (this.isDebug) console.log('triggerOpenURL: END');
    }

    updateRecord = function(context,value) {
        if (this.isDebug) console.log('updateRecord: START');

        if (this.isDebug) console.log('updateRecord: new value ',JSON.stringify(value));
        if (this.isDebug) console.log('updateRecord: current context ',JSON.stringify(context));

        let displayItem = this.displayItems[context.index];
        if (this.isDebug) console.log('updateRecord: displayItem fetched ',JSON.stringify(displayItem));
        let outputItem = this.outputList[context.index];
        if (this.isDebug) console.log('updateRecord: outputItem fetched ',JSON.stringify(outputItem));

        for(let field in value){
            if (this.isDebug) console.log('updateRecord: processing field ',field);
            outputItem[field] = value[field];
            displayItem.value[field] = value[field];
            if (field === this.nameField) {
                if (this.isDebug) console.log('updateRecord: updating name field');
                displayItem.label = value[field];
            }
            let detailItem =  displayItem.details.find(item => item.name === field);
            let fieldDesc = this.detailFieldsJson.find(item => item.name === field);
            if (detailItem) {
                if (this.isDebug) console.log('updateRecord: updating detail field',JSON.stringify(fieldDesc));
                detailItem.value = this.formatField(value[field],fieldDesc);
            }
            else if (fieldDesc) {
                if (this.isDebug) console.log('updateRecord: adding detail field',JSON.stringify(fieldDesc));
                displayItem.details.push({
                    "label": fieldDesc.label,
                    "name": fieldDesc.name,
                    "value": this.formatField(value[field],fieldDesc)
                });
            } 
            else {
                if (this.isDebug) console.log('updateRecord: ignoring field for details',field);
            }
        } 
        displayItem.actions = this.formatActions(this.actionListJson,outputItem)
        if (this.isDebug) console.log('updateRecord: displayItem updated ',JSON.stringify(displayItem));
        if (this.isDebug) console.log('updateRecord: outputItem updated ',JSON.stringify(outputItem));

        if (this.isDebug) console.log('updateRecord: END'); 
    }

    editRecord = function(context,params) {
        if (this.isDebug) console.log('updateRecord: START');

        if (this.isDebug) console.log('updateRecord: context ',JSON.stringify(context));
        if (this.isDebug) console.log('updateRecord: params ',JSON.stringify(params));
        
        params.fields.forEach(eachField => {
            eachField.value = context.value[eachField.name];
        });
        if (this.isDebug) console.log('updateRecord: field values initialised ',JSON.stringify(params.fields));

        this.modalDisplayItem = context;
        this.modalHeader = params.header;
        this.modalFields = params.fields;
        this.showModal = true;

        if (this.isDebug) console.log('updateRecord: END'); 
    }



    // Context Merge Utilities
    mergeString = function(templateString,tokens,context) {
        if (this.isDebug) console.log('mergeString: START with templateString ',templateString);
        //console.log('mergeString: context provided ',JSON.stringify(context));

        let mergedString = templateString;
        tokens.forEach(token => {
            //console.log('mergeString: processing token ',token);

            let tokenKey = token['token'];
            //console.log('mergeString: tokenKey extracted ',tokenKey);
            let tokenValue = context[token['field']];
            //console.log('mergeString: tokenValue extracted ',tokenValue);

            if (tokenValue != null) {
                let tokenRegex = new RegExp(tokenKey, 'g');

                mergedString = mergedString.replace(tokenRegex,tokenValue);
                //console.log('mergeString: mergedString updated ',mergedString);
            }
            else {
                console.warn('mergeString: no value available for token ', tokenKey);
            }
        });
        if (this.isDebug) console.log('mergeString: END with mergedString ',mergedString);
        return mergedString;
    }

    parseString = function(templateString) {
        if (this.isDebug) console.log('parseString: START with templateString ',templateString);

        // eslint-disable-next-line no-useless-escape
        let regexp = /\{\{\{([\.\w]*)\}\}\}/gi;
        //console.log('parseString: regexp', regexp);
        let mergeKeys = templateString.match(regexp);
        //console.log('parseString: mergeKeys extracted ', mergeKeys);

        if (! mergeKeys) {
            console.warn('parseString: END / no mergeKeys found');
            return [];
        }
        //console.log('parseString: mergeKeys not null');

        let mergeFields = [];
        mergeKeys.forEach(mergeKey => {
            //console.log('parseString: processing mergeKey',mergeKey);
            let mergeField = ((mergeKey.replace(/\{|\}/gi,'')).trim());
            //console.log('parseString: mergeField extracted', mergeField);
            mergeFields.push({
                "token":mergeKey,
                "field":mergeField
            });
        });

        if (this.isDebug) console.log('parseString: END / returning ',mergeFields);
        return mergeFields;
    }

    // Format Utilities
    formatField = function(fieldValue,fieldDesc) {
        //console.log('formatField: START with field ',fieldDesc);
        //console.log('formatField: and value ',fieldValue);
        switch (fieldDesc.type) {
            case 'BOOLEAN':
                return (fieldValue?'☑︎':'☐');
            case 'STRING':
                return fieldValue;
            case 'DATE':
            case 'DATETIME':
                return new Intl.DateTimeFormat(LOCALE).format(new Date(fieldValue));
            case 'CURRENCY':
                return CURRENCY_FMT.format(fieldValue);
            case 'DOUBLE':
            case 'INT':
            case 'LONG':
                return NUMBER_FMT.format(fieldValue);
            case 'PERCENT':
                return PERCENT_FMT.format(fieldValue/100);
            case 'TEXTAREA':
                const parser = new DOMParser();
                let valueElement = parser.parseFromString(fieldValue.replace(/<[^>]*>?/gm, ' '), 'text/html');
                return valueElement.body.innerText;
                //return fieldValue.replace(/<[^>]*>?/gm, ' ');
            default:
                return '' + fieldValue;
        }
    }

    formatActions = function(actions,record) {
        if (this.isDebug) console.log('formatActions: START');

        let recordActions = [];
        actions.forEach(action => {
            if (this.isDebug) console.log('formatActions: processing action ',action);

            let recordAction = JSON.parse(JSON.stringify(action));
            //console.log('formatActions: action cloned for record ',recordAction);
            recordActions.push(recordAction);

            if (action.evalOptions) {
                if (record[action.optionsField]) {
                    recordAction.options = JSON.parse(record[action.optionsField]);
                    if (this.isDebug) console.log('formatActions: options evaluated for action ',recordAction.options);
                }
                else {
                    recordAction.options = [];
                    if (this.isDebug) console.log('formatActions: empty options set for action ');
                }
            }
            else if (action.options) {
                if (this.isDebug) console.log('formatActions: proccessing options',action.options);
                action.options.forEach((option,index) => {
                    if (this.isDebug) console.log('formatActions: processing option ',option);
                    if (option.evalDisabled) {
                        let statusStr = this.mergeString(option.isDisabled,option.disabledTokens,record);
                        if (this.isDebug) console.log('formatActions: statusStr merged for option ', statusStr);
                        recordAction.options[index].isDisabled = eval(statusStr);
                        if (this.isDebug) console.log('formatActions: disabled state evaluated for option ', recordAction.options[index].isDisabled);
                    }
                })
            }

            if (action.evalDisabled) {
                let statusStr = this.mergeString(action.isDisabled,action.disabledTokens,record);
                if (this.isDebug) console.log('formatActions: statusStr merged for option ', statusStr);
                recordAction.isDisabled = eval(statusStr);
                if (this.isDebug) console.log('formatActions: disabled state evaluated for action ',recordAction.isDisabled);
            }
            if (this.isDebug) console.log('formatActions: action contextualised ',recordAction);
        });
        if (this.isDebug) console.log('formatActions: all actions contextualised ',recordActions);
        return recordActions;   
    }
}