/* eslint-disable no-console */

/***
* @author P-E GROS
* @date   Apr. 2023
* @description  LWC Component for Flows enabling to trigger a lightning Data Service
*               cache refresh of a set of records (modified by the flow) and redirect
*               the user to a given page reference. Should be positioned in a last Flow
*               page, the logic being triggered automatically upon component initiation
*
* Legal Notice
* 
* MIT License
* 
* Copyright (c) 2023 pegros
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

import { LightningElement, api } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
import { notifyRecordUpdateAvailable } from 'lightning/uiRecordApi';

export default class SfpegPageRedirectFlw extends NavigationMixin(LightningElement) {

    //----------------------------------------------------------------
    // Main configuration fields (for Flow Builder)
    //----------------------------------------------------------------
    @api pageRef;           // Target page Ref to redirect the user to
    @api recordIds;         // List of record IDs to refresh before redirecting
    @api isDebug;           // Debug activation flag

    //----------------------------------------------------------------
    // Technical parameters
    //----------------------------------------------------------------
    error;                  // Error displayed

    //----------------------------------------------------------------
    // Custom Getters
    //----------------------------------------------------------------
    get recordIdList() {
        return JSON.stringify(this.recordIds || '');
    }

    //----------------------------------------------------------------
    // Component Initialisation
    //----------------------------------------------------------------
    connectedCallback() {
        if (this.isDebug) console.log('connected: START page redirect');

        if (this.isDebug) console.log('connected: pageRef provided ', this.pageRef);
        if (this.isDebug) console.log('connected: recordIds provided ', this.recordIds);

        try {
            if (this.recordIds) {
                if (this.isDebug) console.log('connected: processing records refresh');
                let records = [];
                this.recordIds.forEach(item => {
                    records.push({recordId: item});
                });
                if (this.isDebug) console.log('connected: records ID list prepared ',records);

                notifyRecordUpdateAvailable(records);
                if (this.isDebug) console.log('connected: record refresh triggered ');
            }
        }
        catch (error) {
            console.warn('connected: END KO page redirect / record refresh issue ',error);
            this.error = 'Record refresh issue: ' + JSON.stringify(error);
            return;
        }

        if (!this.isDebug) {
            if (this.isDebug) console.log('connected: processing redirection');

            if (this.redirect()) {
                if (this.isDebug) console.log('connected: END OK page redirect');
            }
            else {
                console.warn('connected: END KO page redirect / redirection issue');
            }
        }
        else {
            if (this.isDebug) console.log('connected: END OK page redirect / awaiting user confirmation');
        }
    }

    //----------------------------------------------------------------
    // Event Handlers
    //----------------------------------------------------------------
    handleClick(event) {
        if (this.isDebug) console.log('handleClick: START page redirect');

        if (this.redirect()) {
            if (this.isDebug) console.log('handleClick: END OK page redirect');
        }
        else {
            console.warn('handleClick: END KO page redirect / redirection issue');
        }
    }

    //----------------------------------------------------------------
    // Component Utilities
    //----------------------------------------------------------------
    redirect = function() {
        if (this.isDebug) console.log('redirect: START');

        try {
            let targetPage = JSON.parse(this.pageRef);
            if (this.isDebug) console.log('redirect: targetPage parsed ',targetPage);

            this[NavigationMixin.Navigate](targetPage);
            if (this.isDebug) console.log('redirect: END OK');
            return true;
        }
        catch (error) {
            console.warn('redirect: END KO / parsing or redirection issue ',error);
            this.error = 'Redirection issue: ' + JSON.stringify(error);
            return false;
        }
    }
}