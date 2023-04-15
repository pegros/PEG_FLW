import { LightningElement, api } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';

export default class SfpegForceRedirectCmp extends NavigationMixin(LightningElement) {

    //----------------------------------------------------------------
    // Main configuration fields (for Flow Builder)
    //----------------------------------------------------------------
    @api recordId;          // Target record Id
    @api objectApiName;     // Target object Name (required in LWR context)
    @api isDebug;           // Debug activation flag

    //----------------------------------------------------------------
    // Component Initialisation
    //----------------------------------------------------------------
    connectedCallback() {
        if (this.isDebug) console.log('connected: START');

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
        if (this.isDebug) console.log('connected: redirecting to targetPage ', JSON.stringify(targetPage));

        if (!this.isDebug) this[NavigationMixin.Navigate](targetPage);

        if (this.isDebug) console.log('connected: END');
    }

    handleClick(event) {
        if (this.isDebug) console.log('handleClick: START');

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
        if (this.isDebug) console.log('handleClick: redirecting to targetPage ', JSON.stringify(targetPage));

        this[NavigationMixin.Navigate](targetPage);
        if (this.isDebug) console.log('handleClick: END');
    }
}