/* eslint-disable no-console */

/***
* @author P-E GROS
* @date   Apr. 2023
* @description  LWC Component enabling to launch a flow within a Lightning tab
*               while setting various input parameters out of the tab page state. 
*               It also triggers an automatic redirection to a target page upon
*               completion.
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

import { LightningElement, api, wire } from 'lwc';
import { CurrentPageReference } from 'lightning/navigation';
import { NavigationMixin } from 'lightning/navigation';


export default class SfpegFlowEmbedFlw extends NavigationMixin(LightningElement) {

    //-----------------------------------
    // Configuration Parameters (from page state)
    //-----------------------------------
    flowName;           // API Name of the flow to launch
    flowParameters;     // List of Flow Input Parameters to set from Page Context (JSON List of string)
    outputTarget;       // Flow Output parameter providing the target page ref to redirect the user to.
    outputRefresh;      // Flow Output parameter providing the list of record IDs to refresh prior to redirection.

    isDebug = false;   // Flag to activate debug information.

    //-----------------------------------
    // Technical Parameters
    //-----------------------------------
    isReady = false;    
    error = false;
    
    //-----------------------------------
    // Custom Labels
    //-----------------------------------
    wrappingCss = 'slds-box slds-theme_default';

    //-----------------------------------
    // Custom Getters
    //-----------------------------------
    
    //-----------------------------------
    // Page Context Parameters
    //-----------------------------------
    @wire(CurrentPageReference) 
    wiredPageRef;

    //-----------------------------------
    // Custom Getters
    //-----------------------------------
    connectedCallback() {
        this.isDebug = this.wiredPageRef.state.c__isDebug;
        if (this.isDebug) console.log('connected: START for flow embed ');

        if (this.isDebug) console.log('connected: wiredPageRef ',this.wiredPageRef);

        this.flowParameters= [];
        for (let field in this.wiredPageRef?.state) {
            switch (field) {
                case 'c__isDebug':
                    break;
                case 'c__flow':
                    this.flowName =  this.wiredPageRef.state.c__flow;
                    break;
                case 'c__target':
                    this.outputTarget = this.wiredPageRef.state.c__target;
                    break;
                case 'c__refresh':
                    this.outputRefresh = this.wiredPageRef.state.c__refresh;
                    break;
                default:
                    this.flowParameters.push({name:field.substring(3), type:"String",value:this.wiredPageRef.state[field]});
            }
        } 
        if (this.isDebug) console.log('connected: all context params processed ');


        if (this.isDebug) console.log('connected: flowName ',this.flowName);
        if (!this.flowName) {
            this.error = 'Missing Flow Name as input';
            console.warn('connected: END KO for flow embed / Missing Flow Name');
            return;
        }

        /*this.inputParams = this.wiredPageRef.status.c__input;
        if (this.isDebug) console.log('connected: inputParams ',this.inputParams);
        if (this.inputParams) {
            if (this.isDebug) console.log('connected: processing input params');
            let flowParameters = [];
            try {
                let inputList = JSON.parse(this.inputParams);
                inputList.forEach(item => {
                    if (this.isDebug) console.log('connected: processing param ', item.name);
                    if (this.isDebug) console.log('connected: of type ', item.type);
                    item.value == this.wiredPageRef.status[item.name];
                    if (this.isDebug) console.log('connected: context value fetched ', item.value);
                    if (item.value != null) {
                        if (this.isDebug) console.log('connected: registering value');
                        flowParameters.push(item);
                    }
                    else {
                        if (this.isDebug) console.log('connected: ignoring field with no value ', item.name);
                    }
                });
            }
            catch (error) {
                console.warn('connected: END KO for flow embed / Bad input parameters ', error);
                this.error = 'Bad Flow input parameters';
            }
            if (this.isDebug) console.log('connected: input parameters init ', flowParameters);
            this.flowParameters = flowParameters;
        }*/
        
        if (this.isDebug) console.log('connected: outputTarget ',this.outputTarget);
        if (!this.outputTarget) {
            this.error = 'Not output target parameter provided';
            console.warn('connected: END KO for flow embed / Missing Flow output target');
            return;
        }

        if (this.isDebug) console.log('connected: outputTarget ',this.outputTarget);
        if (!this.outputTarget) {
            this.error = 'Not output target parameter provided';
            console.warn('connected: END KO for flow embed / Missing Flow output target');
            return;
        }

        if (this.isDebug) console.log('connected: flowParameters ',JSON.stringify(this.flowParameters));

        /*this.inputParams = this.wiredPageRef.status.c__input;
        if (this.isDebug) console.log('connected: inputParams ',this.inputParams);
        if (this.inputParams) {
            if (this.isDebug) console.log('connected: processing input params');
            let flowParameters = [];
            try {
                let inputList = JSON.parse(this.inputParams);
                inputList.forEach(item => {
                    if (this.isDebug) console.log('connected: processing param ', item.name);
                    if (this.isDebug) console.log('connected: of type ', item.type);
                    item.value == this.wiredPageRef.status[item.name];
                    if (this.isDebug) console.log('connected: context value fetched ', item.value);
                    if (item.value != null) {
                        if (this.isDebug) console.log('connected: registering value');
                        flowParameters.push(item);
                    }
                    else {
                        if (this.isDebug) console.log('connected: ignoring field with no value ', item.name);
                    }
                });
            }
            catch (error) {
                console.warn('connected: END KO for flow embed / Bad input parameters ', error);
                this.error = 'Bad Flow input parameters';
            }
            if (this.isDebug) console.log('connected: input parameters init ', flowParameters);
            this.flowParameters = flowParameters;
        }*/

        this.isReady = true;
        /*setTimeout(function (){
            document.title = 'FLOW';
        },10000);*/
        if (this.isDebug) console.log('connected: END for flow embed');
    }


    //-----------------------------------
    // Event Handlers
    //-----------------------------------
    handleStatusChange(event) {
        if (this.isDebug) console.log('handleStatusChange: START for flow embed ', this.flowName);
        if (this.isDebug) console.log('handleStatusChange: event ', event);
        if (this.isDebug) console.log('handleStatusChange: status ', event.detail.status);

        if (event.detail.status !== 'FINISHED') {
            if (this.isDebug) console.log('handleStatusChange: END for flow embed / event ignored');
            return;
        }

        if (this.isDebug) console.log('handleStatusChange: navigating to target');
        if (this.isDebug) console.log('handleStatusChange: looking for output target param ', this.outputTarget);
        if (this.isDebug) console.log('handleStatusChange: looking for output refresh param ', this.outputRefresh);
        if (this.isDebug) console.log('handleStatusChange: flow output ', JSON.stringify(event.detail.outputVariables));


        if (this.outputRefresh) {
            if (this.isDebug) console.log('connected: processing records refresh');

            try {
                let refreshParam =  event.detail.outputVariables.find(item => {return item.name === this.outputRefresh;});
                if (this.isDebug) console.log('handleStatusChange: refresh output found ', refreshParam);

                let records = [];
                refreshParam.forEach(item => {
                    records.push({recordId: item});
                });
                if (this.isDebug) console.log('handleStatusChange: records ID list prepared ',records);

                notifyRecordUpdateAvailable(records);
                if (this.isDebug) console.log('handleStatusChange: record refresh triggered ');
            }
            catch (error) {
                console.warn('handleStatusChange: refresh processing issue ',error);
            }
        }
        else {
            if (this.isDebug) console.log('connected: no records refresh to process');
        }


        let targetParam =  event.detail.outputVariables.find(item => {return item.name === this.outputTarget;});
        if (this.isDebug) console.log('handleStatusChange: target output found ', targetParam);

        if (!targetParam) {
            console.warn('handleStatusChange: END KO / output param not found');
            this.error = 'Missing target output';
            this.isReady = false;
            return;
        }

        try {
            let targetPage = JSON.parse(targetParam.value);
            if (this.isDebug) console.log('handleStatusChange: targetPage parsed ',targetPage);

            this[NavigationMixin.Navigate](targetPage);
            if (this.isDebug) console.log('handleStatusChange: END OK');
        }
        catch (error) {
            console.warn('handleStatusChange: END KO / parsing or redirection issue ',error);
            this.error = 'Redirection issue!';
            this.isReady = false;
        }
    }

}