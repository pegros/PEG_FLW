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