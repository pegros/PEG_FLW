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
import { notifyRecordUpdateAvailable } from 'lightning/uiRecordApi';
import { FlowNavigationFinishEvent, FlowNavigationNextEvent } from 'lightning/flowSupport';
import { NavigationMixin } from 'lightning/navigation';

export default class SfpegPageRedirectFlw extends NavigationMixin(LightningElement) {

    //----------------------------------------------------------------
    // Main configuration fields (for Flow Builder)
    //----------------------------------------------------------------
    @api showButton;        // Flag to display a manual navigation button instead of automatically navigation upon init
    @api buttonLabel;       // Label of the navigate button            
    @api buttonTitle;       // Title of the navigate button            
    @api buttonVariant;     // Variant of the navigate button            
    @api pageRef;           // Target page Ref to redirect the user to
    @api recordIds;         // List of record IDs to refresh before redirecting
    @api triggerNext;       // Flag to trigger "next" or "complete" when no redirection is triggered
    @api wrappingCss;       // Wrapping class for the component
    @api isDebug;           // Debug activation flag

    //----------------------------------------------------------------
    // Technical parameters
    //----------------------------------------------------------------
    error;                  // Error displayed

    @api   availableActions = [];   // Flow Context Information

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

        if (this.isDebug) console.log('connected: showButton provided ', this.showButton);
        if (this.isDebug) console.log('connected: buttonLabel provided ', this.buttonLabel);
        if (this.isDebug) console.log('connected: buttonTitle provided ', this.buttonTitle);
        if (this.isDebug) console.log('connected: pageRef provided ', this.pageRef);
        if (this.isDebug) console.log('connected: recordIds provided ', JSON.stringify(this.recordIds));
        if (this.isDebug) console.log('connected: triggerNext provided ', this.triggerNext);
        if (this.isDebug) console.log('connected: available flow actions',JSON.stringify(this.availableActions));

        if (!this.showButton) {
            if (this.isDebug) console.log('connected: processing automatic redirection');

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
        if (this.isDebug) console.log('handleClick: START manual page redirect');

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

        if (this.recordIds) {
            if (this.isDebug) console.log('redirect: processing records refresh', JSON.stringify(this.recordIds));
            try {
                let records = [];
                this.recordIds.forEach(item => {
                    records.push({recordId: item});
                });
                if (this.isDebug) console.log('redirect: records ID list prepared ',JSON.stringify(records));

                notifyRecordUpdateAvailable(records);
                if (this.isDebug) console.log('redirect: record refresh triggered ');
            }
            catch (error) {
                console.warn('redirect: END KO / record refresh failed for records ',JSON.stringify(this.recordIds));
                this.error = 'Record refresh issue: ' + JSON.stringify(error);
                return false; 
            }
        }
        else {
            if (this.isDebug) console.log('redirect: no record refresh to process');
        }

        if (this.pageRef) {
            if (this.isDebug) console.log('redirect: processing redirect to pageRef ',this.pageRef);
            let targetPage;
            try {
                targetPage = JSON.parse(this.pageRef);
                if (this.isDebug) console.log('redirect: targetPage parsed ',JSON.stringify(targetPage));
            }
            catch (error) {
                console.warn('redirect: targetPage parsing failed with input ',this.pageRef);
                this.error = 'Target page parsing issue: ' + JSON.stringify(error);
                return false;
            }

            try {
                this[NavigationMixin.Navigate](targetPage);
                if (this.isDebug) console.log('redirect: navigation triggered');
            }
            catch (error) {
                console.warn('redirect: targetPage navigation failed ',JSON.stringify(targetPage));
                this.error = 'Navigation to target page failed: ' + JSON.stringify(error);
                return false;
            }
        }
        else {
            if (this.isDebug) console.log('redirect: no redirection configured');
        }

        if (this.triggerNext) {
            if (this.isDebug) console.log('redirect: processing NEXT/FINISH trigger with available flow actions',JSON.stringify(this.availableActions));

            if (this.availableActions.find(action => action === 'FINISH')) {
                // terminate the flow
                if (this.isDebug) console.log('redirect: triggering FINISH event');
                const navigateFinishEvent = new FlowNavigationFinishEvent();
                this.dispatchEvent(navigateFinishEvent);
                if (this.isDebug) console.log('redirect: FINISH event triggered');
            }
            else if (this.availableActions.find(action => action === 'NEXT')) {
                // navigate to the next screen
                if (this.isDebug) console.log('redirect: triggering NEXT event');
                const navigateNextEvent = new FlowNavigationNextEvent();
                this.dispatchEvent(navigateNextEvent);
                if (this.isDebug) console.log('redirect: NEXT event triggered');
            }
            else {
                if (this.isDebug) console.log('redirect: NEXT or FINISH events not available');
            }
        }
        else {
            if (this.isDebug) console.log('redirect: no trigger NEXT/FINISH configured');
        }

        if (this.isDebug) console.log('redirect: END OK');
        return true;
    }
}