/* eslint-disable no-console */

/***
* @author P-E GROS
* @date   Apr. 2023
* @description  LWC Component enabling to display a flow within a standard popup.
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

import { api } from 'lwc';
import LightningModal from 'lightning/modal';

export default class SfpegFlowPopupDsp extends LightningModal {
    //-----------------------------------
    // Configuration Parameters (from page state)
    //-----------------------------------
    @api label;
    @api size;
    @api description;
    @api flowName;          // API Name of the flow to launch
    @api flowParameters;    // Flow input parameters
    @api flowOutput;        // Flow Output parameter providing the list of record IDs to refresh prior to redirection.

    @api isDebug = false;   // Flag to activate debug information.

    //-----------------------------------
    // Technical Parameters
    //-----------------------------------
    //-----------------------------------
    // Component Initialisation
    //-----------------------------------
    connectedCallback() {
        if (this.isDebug) console.log('connected: START for Flow launch ',this.label);
        if (this.isDebug) console.log('connected: size ',this.size);
        if (this.isDebug) console.log('connected: description ',this.description);

        if (this.isDebug) console.log('connected: flowName ',this.flowName);
        if (this.isDebug) console.log('connected: flowParameters ',this.flowParameters);
        if (this.isDebug) console.log('connected: flowOutput ',this.flowOutput);

        if (this.isDebug) console.log('connected: END for Flow launch');
    }

    //-----------------------------------
    // Event Handlers
    //-----------------------------------
    trackFlow(event) {
        if (this.isDebug) console.log('trackFlow: START for flow popup ', this.label);
        if (this.isDebug) console.log('trackFlow: event ', event);
        if (this.isDebug) console.log('trackFlow: status ', event.detail.status);

        if (event.detail.status !== 'FINISHED') {
            if (this.isDebug) console.log('trackFlow: END for flow popup / event ignored');
            return;
        }

        if (this.flowOutput) {
            if (this.isDebug) console.log('trackFlow: fetching records refresh');

            let refreshParam =  event.detail.outputVariables.find(item => {return item.name === this.flowOutput;});
            if (this.isDebug) console.log('trackFlow: refresh output found ', refreshParam);

            if (refreshParam) {
                if (this.isDebug) console.log('trackFlow: END for flow popup / returning output ', refreshParam.value);
                this.close(refreshParam.value);
            }
            else {
                if (this.isDebug) console.log('trackFlow: END for flow popup / no output provided');
                this.close(null);
            }
        }
        else {
            if (this.isDebug) console.log('trackFlow: END for flow popup / no output configured');
            this.close(null);
        }
    }

}