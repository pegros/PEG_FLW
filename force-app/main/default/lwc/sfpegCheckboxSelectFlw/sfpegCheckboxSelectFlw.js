/***
* @author P-E GROS
* @date   Feb. 2022
* @description  LWC Component for Flows enabling to display a set of options to select from.
*               The list of options is provided as a list of records grouped according to a
*               grouping field value. As an output users may get the set of selected items
*               or the sets of added/removed items from a preselection.
*
* Legal Notice
* 
* MIT License
* 
* Copyright (c) 2022 pegros
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

import { LightningElement, api, track } from 'lwc';

export default class SfpegCheckboxSelectFlw extends LightningElement {

    //-------------------------------------------------------------
    // Configuration Parameters
    //-------------------------------------------------------------
    @api cardTitle;                 // Title of the wrapping Card
    @api cardIcon;                  // Icon of the wrapping Card
    @api cardClass;                 // CSS Classes for the wrapping card div

    @api recordList = [];           // input record list to display
    @api preselectionList = [];     // input preselected record list
    @api selectionList = [];        // output selected record list
    @api addedList = [];            // output list of newly selected elements
    @api removedList = [];          // output list of preselected elements removed

    @api keyField;                  // API Name of the field used to uniquely identify records (e.g. if same label used in 2 sections)
    @api sectionField;              // API Name of the field used to group values
    @api labelField;                // API Name of the field used to display values

    @api columnNumber = 2;          // Number of displayed columns (should be a divider of 12) 
    @api isDebug = false;           // Flag to display debug info.

    //-------------------------------------------------------------
    // Internal Parameters
    //-------------------------------------------------------------
    @track isReady = false;         // Flag indicating that the component initiation is complete
    @track sectionList = [];        // List of sections and options corresponding to the record list
    @track errorMessage;            // Error message for display
    hasPreselection = false;        // Flag indicating whether there is preselection to handle

    //-------------------------------------------------------------
    // Custom Getters
    //-------------------------------------------------------------

    get sectionSize() {
        return 12 / this.columnNumber;
    }

    //-------------------------------------------------------------
    // Component Initialisation
    //-------------------------------------------------------------

    connectedCallback() {
        if (this.isDebug) console.log('connected: START');

        if (this.isDebug) console.log('connected: keyField provided ', this.keyField);
        if (this.isDebug) console.log('connected: sectionField provided ',this.sectionField);
        if (this.isDebug) console.log('connected: labelField provided ',this.labelField);
        if ((!this.keyField) || (!this.sectionField) || (!this.labelField)) {
            console.warn('connected: END KO / missing field configuration ');
            this.errorMessage = "Missing field configuration";
            this.isReady = true;
            return;
        }

        if (this.isDebug) console.log('connected: recordList provided ', JSON.stringify(this.recordList));
        if ((!this.recordList) || (this.recordList.length == 0)) {
            console.warn('connected: END KO / no/empty recordList provided ');
            this.errorMessage = "No/empty recordList provided";
            this.isReady = true;
            return;
        }

        if (this.isDebug) console.log('connected: initializing sections');

        if (this.isDebug) console.log('connected: preselectionList provided ', JSON.stringify(this.preselectionList));
        if ((this.preselectionList) && (this.preselectionList.length > 0)) {
            if (this.isDebug) console.log('connected: preselection to handle');
            this.hasPreselection = true;
        }
        else {
            if (this.isDebug) console.log('connected: no preselection to handle');
        }

        this.recordList.forEach(item => {
            if (this.isDebug) console.log('connected: handling record ',JSON.stringify(item));
            let itemKey = item[this.keyField];
            let itemSection = item[this.sectionField];
            let itemLabel = item[this.labelField];
            let section = this.sectionList.find(item => item.label === itemSection);
            if (!section) {
                if (this.isDebug) console.log('connected: initializing section ',itemSection);
                section = {label: itemSection, options: [], selected: []};
                this.sectionList.push(section);
            }
            section.options.push({label: itemLabel, value: itemKey});
            if (this.hasPreselection) {
                let selection = this.preselectionList.find(item => item[this.keyField] == itemKey);
                if (selection) {
                    if (this.isDebug) console.log('connected: preselecting value ', itemKey);
                    section.selected.push(itemKey);
                }
            }
        });
        if (this.isDebug) console.log('connected: section initialized ', JSON.stringify(this.sectionList));

        this.selectionList = [...this.preselectionList];
        this.addedList = [];
        this.removedList = [];

        this.isReady = true;
        if (this.isDebug) console.log('connected: END');
    }

    //-------------------------------------------------------------
    // Internal Parameters
    //-------------------------------------------------------------
    handleOptionChange(event) {
        if (this.isDebug) console.log('handleOptionChange: START');

        let section = event.currentTarget.name;
        if (this.isDebug) console.log('handleOptionChange: section involved ', section);

        let selection = event.detail.value;
        if (this.isDebug) console.log('handleOptionChange: new section selection ', JSON.stringify(selection));

        this.selectionList = this.selectionList.filter(item => item[this.sectionField] !== section);
        if (this.isDebug) console.log('handleOptionChange: selectionList filtered', JSON.stringify(this.selectionList));
        this.addedList = this.addedList.filter(item => item[this.sectionField] !== section);
        if (this.isDebug) console.log('handleOptionChange: addedList filtered', JSON.stringify(this.addedList));
        this.removedList = this.removedList.filter(item => item[this.sectionField] !== section);
        if (this.isDebug) console.log('handleOptionChange: removedList filtered', JSON.stringify(this.removedList));

        selection.forEach(item => {
            if (this.isDebug) console.log('handleOptionChange: processing selected item ', item);
            let recordItem = this.recordList.find(iter => iter[this.keyField] === item);
            this.selectionList.push(recordItem);
            if (this.hasPreselection) {
                let preselectItem = this.preselectionList.find(iter => iter[this.keyField] === item);
                if (preselectItem) {
                    if (this.isDebug) console.log('handleOptionChange: ignoring new addition (preselected)');
                }
                else {
                    if (this.isDebug) console.log('handleOptionChange: registering new addition (not preselected)');
                    this.addedList.push(recordItem);
                }
            }
            else {
                if (this.isDebug) console.log('handleOptionChange: registering default addition ');
                this.addedList.push(recordItem);
            }
        });
        if (this.isDebug) console.log('handleOptionChange: selectionList reset ', JSON.stringify(this.selectionList));
        if (this.isDebug) console.log('handleOptionChange: addedList reset ', JSON.stringify(this.addedList));

        if (this.hasPreselection) {
            if (this.isDebug) console.log('handleOptionChange: processing preselection removals');
            this.preselectionList.forEach(item => {
                if (item[this.sectionField] !== section) {
                    if (this.isDebug) console.log('handleOptionChange: preselected item ignored (other section)');
                }
                else {
                    let addItem = this.selectionList.find(iter => iter[this.keyField] === item[this.keyField]);
                    if (addItem) {
                        if (this.isDebug) console.log('handleOptionChange: preselected item kept ',JSON.stringify(item));
                    }
                    else {
                        if (this.isDebug) console.log('handleOptionChange: registering item as removed ',JSON.stringify(item));
                        this.removedList.push(item);
                    }
                }
            })
        }
        else {
            if (this.isDebug) console.log('handleOptionChange: ignoring preselection removals');
        }
        if (this.isDebug) console.log('handleOptionChange: removedList reset ', JSON.stringify(this.removedList));

        let changeEvent = new CustomEvent('selectionChange', {
            "detail": {
                selection:  this.selectionList,
                added:      this.addedList,
                removed:    this.removedList
            }
        });
        if (this.isDebug) console.log('handleOptionChange: changeEvent init',JSON.stringify(changeEvent));   
        this.dispatchEvent(changeEvent);
        if (this.isDebug) console.log('handleOptionChange: changeEvent dispatched');

        if (this.isDebug) console.log('handleOptionChange: END');
    }

}