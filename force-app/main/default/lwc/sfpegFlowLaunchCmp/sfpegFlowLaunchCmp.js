/* eslint-disable no-console */

/***
* @author P-E GROS
* @date   Apr. 2023
* @description  LWC Component enabling to launch a flow within a Lightning page
*               only upon user interactio (i.e. not automatically upon page display).
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
import sfpegFlowPopupDsp from 'c/sfpegFlowPopupDsp';

export default class SfpegFlowLaunchCmp extends LightningElement {

    //-----------------------------------
    // Configuration Parameters (from page state)
    //-----------------------------------
    @api flowName;          // API Name of the flow to launch
    @api flowInput;         // List of Flow Input Parameters to set from Page Context (JSON List of string)
    @api flowOutput;        // Flow Output parameter providing the list of record IDs to refresh prior to redirection.

    @api startLabel = "Start";
    @api stopLabel = "Stop";
    @api startVariant = 'brand';
    @api stopVariant = 'container';

    @api isPopup = false;
    @api popupSize = 'small'; //  small, medium, or large.
    @api popupLabel;

    @api wrappingCss = 'slds-box slds-theme_default';

    @api isDebug = false;   // Flag to activate debug information.

    //-----------------------------------
    // Technical Parameters
    //-----------------------------------
    flowParameters;
    isReady = false;    
    isRunning = false;    
    error = false;
    
    //-----------------------------------
    // Context Information
    //-----------------------------------
    @api recordId;
    @api objectApiName;

    //-----------------------------------
    // Component Initialisation
    //-----------------------------------
    connectedCallback() {
        if (this.isDebug) console.log('connected: START for Flow launch');

        if (this.isDebug) console.log('connected: flowName ',this.flowName);
        if (!this.flowName) {
            this.error = 'Missing Flow Name as input';
            console.warn('connected: END KO for flow launch / Missing Flow Name');
            return;
        }
        
        if (this.isDebug) console.log('connected: flowInput ',this.flowInput);
        if (this.flowInput) {
            try {
                let inputs = JSON.parse(this.flowInput);
                this.flowParameters = [];
                if (this.isDebug) console.log('connected: inputs parsed ',this.inputs);
                inputs.forEach(item => {
                    switch (item.name) {
                        case 'recordId' :
                            if (this.recordId) {
                                item.value = this.recordId;
                                item.type = 'String';
                                this.flowParameters.push(item);
                            }
                            break;
                        case 'objectApiName' :
                            if (this.objectApiName) {
                                item.value = this.objectApiName;
                                item.type = 'String';
                                this.flowParameters.push(item);
                            }
                            break;
                        default:
                            if (!item.type) item.type = 'String';
                            this.flowParameters.push(item);
                    }
                });
                if (this.isDebug) console.log('connected: flowParameters finalised ', JSON.stringify(this.flowParameters));
            }
            catch (error) {
                this.error = 'Issue when initialising input';
                console.warn('connected: END KO for flow launch /Issue when initialising input ',error);
                return;
            }
        }

        if (this.isDebug) console.log('connected: flowOutput ',this.flowOutput);

        if (this.isDebug) console.log('connected: isPopup ',this.isPopup);

        this.isReady = true;
        if (this.isDebug) console.log('connected: END for Flow launch');
    }

    //-----------------------------------
    // Event Handlers
    //-----------------------------------
    startFlow(event) {
        if (this.isDebug) console.log('startFlow: START');
        if (this.isDebug) console.log('startFlow: flow name fetched ',this.flowName);
        this.isRunning = true;

        if (this.isPopup) {
            if (this.isDebug) console.log('startFlow: launching flow in popup');
            sfpegFlowPopupDsp.open({
                label: this.popupLabel,
                size: this.popupSize,
                description: this.popupDescription,
                flowName: this.flowName,
                flowParameters: this.flowParameters,
                flowOutput: this.flowOutput,
                isDebug: this.isDebug 
            }).then (result => {
                if (this.isDebug) console.log('startFlow: records ID list received from popup ', JSON.stringify(result));
                if (result) {
                    if (this.isDebug) console.log('trackFlow: processing records refresh');
                    try {
                        let records = [];
                        result.forEach(item => {
                            records.push({recordId: item});
                        });
                        if (this.isDebug) console.log('startFlow: records ID list prepared ', JSON.stringify(records));

                        notifyRecordUpdateAvailable(records);
                        if (this.isDebug) console.log('startFlow: record refresh triggered ');
                    }
                    catch (error) {
                        console.warn('startFlow: refresh processing issue ',error);
                    }
                }
                else {
                    if (this.isDebug) console.log('startFlow: no records refresh to process');
                }

                this.isRunning = false;
                this.error = null;
                if (this.isDebug) console.log('startFlow: END / popup closed');
            }).catch(error => {
                console.warn('startFlow: popup triggered an error ',error);
                this.isRunning = false;
                this.error = null;
                if (this.isDebug) console.log('startFlow: END / popup closed in error');
            });
            if (this.isDebug) console.log('startFlow: popup opened');
        }
        else {
            if (this.isDebug) console.log('startFlow: END / launching flow inline');
        }
    }

    stopFlow(event) {
        if (this.isDebug) console.log('stopFlow: START');
        if (this.isDebug) console.log('stopFlow: flow name fetched ', this.flowName);
        this.isRunning = false;
        if (this.isDebug) console.log('stopFlow: END');
    }

    trackFlow(event) {
        if (this.isDebug) console.log('trackFlow: START for flow launch ', this.flowName);
        if (this.isDebug) console.log('trackFlow: event ', event);
        if (this.isDebug) console.log('trackFlow: status ', event.detail.status);

        if (event.detail.status !== 'FINISHED') {
            if (this.isDebug) console.log('trackFlow: END for flow launch / event ignored');
            return;
        }

        if (this.flowOutput) {
            if (this.isDebug) console.log('trackFlow: processing records refresh');

            try {
                let refreshParam =  event.detail.outputVariables.find(item => {return item.name === this.flowOutput;});
                if (this.isDebug) console.log('trackFlow: refresh output found ', refreshParam);

                let records = [];
                refreshParam.value.forEach(item => {
                    records.push({recordId: item});
                });
                if (this.isDebug) console.log('trackFlow: records ID list prepared ', JSON.stringify(records));

                notifyRecordUpdateAvailable(records);
                if (this.isDebug) console.log('trackFlow: record refresh triggered ');
            }
            catch (error) {
                console.warn('trackFlow: refresh processing issue ',error);
            }
        }
        else {
            if (this.isDebug) console.log('trackFlow: no records refresh to process');
        }

        this.isRunning = false;
        this.error = null;
        if (this.isDebug) console.log('trackFlow: END for flow launch ');
    }
}