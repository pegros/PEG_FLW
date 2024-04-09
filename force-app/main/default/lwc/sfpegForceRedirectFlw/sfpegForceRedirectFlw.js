import { LightningElement, api } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
import { FlowNavigationFinishEvent } from 'lightning/flowSupport';

export default class SfpegForceRedirectCmp extends NavigationMixin(LightningElement) {

    //----------------------------------------------------------------
    // Main configuration fields (for Flow Builder)
    //----------------------------------------------------------------
    @api recordId;          // Target record Id
    @api objectApiName;     // Target object Name (required in LWR context)
    @api isDebug;           // Debug activation flag

    //----------------------------------------------------------------
    // Technical parameters
    //----------------------------------------------------------------
    @api   availableActions = [];   // Flow Context Information

    //----------------------------------------------------------------
    // Component Initialisation
    //----------------------------------------------------------------
    connectedCallback() {
        if (this.isDebug) console.log('connected: START');
        if (!this.isDebug) this.redirect();
        if (this.isDebug) console.log('connected: END');
    }

    handleClick(event) {
        if (this.isDebug) console.log('handleClick: START');
        this.redirect();
        if (this.isDebug) console.log('handleClick: END');
    }

    redirect = function() {
        if (this.isDebug) console.log('redirect: START');

        let targetPage = {
            type: 'standard__recordPage',
            attributes: {
                recordId: this.recordId,
                actionName: 'view'
            }
        };
        if (this.objectApiName) {
            targetPage.attributes.objectApiName = this.objectApiName;
        }
        if (this.isDebug) console.log('redirect: redirecting to targetPage ', JSON.stringify(targetPage));

        this[NavigationMixin.Navigate](targetPage);
        if (this.isDebug) console.log('redirect: redirection triggered ');

        if (this.availableActions.find(action => action === 'FINISH')) {
            // terminate the flow
            if (this.isDebug) console.log('redirect: triggering FINISH event');
            const navigateFinishEvent = new FlowNavigationFinishEvent();
            this.dispatchEvent(navigateFinishEvent);
            if (this.isDebug) console.log('redirect: FINISH event triggered');
        }

        if (this.isDebug) console.log('redirect: END');
    }
}