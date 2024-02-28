import { LightningElement, api }    from 'lwc';
import {FlowAttributeChangeEvent}   from 'lightning/flowSupport';

export default class SfpegNavigationFlw extends LightningElement {

    @api
    availableActions = [];

    @api mainMessage = 'Please update status.';
    @api mainLabel = 'Go to next step ?';

    get mainLogo() {
        console.log('mainLogo: get ', this._enabled);
        console.log('mainLogo: get ', (this._enabled ? '✅' : '⚠️'));
        return (this._enabled ? '✅' : '⚠️');
    }

    @api
    get enabled() {
        return this._enabled;
    }
    set enabled(newStatus) {
        console.log('isEnabled: set ', newStatus);
        this._enabled = newStatus;
    }
    _enabled = false;

    @api
    get status() {
        return this._status;
    }
    set status(newStatus) {
        this._status = newStatus;
    }
    _status = false;

    connectedCallback() {
        console.log('connected: START');
        console.log('connected: END');
    }

    @api
    validate() {
        console.log('validate: START');

        let status = this.template.querySelector('lightning-input');
        console.log('validate: status fetched ',status);
        console.log('validate: status checked ',status.checked);

        if (status.checked) { 
            console.log('validate: END OK');
            return { isValid: true }; 
        } 
        else { 
            console.log('validate: END KO');
            // If the component is invalid, return the isValid parameter 
            // as false and return an error message. 
            return { 
                isValid: false, 
                errorMessage: 'Impossible to move forward' 
            }; 
        }
    }

    handleChange(event) {
        console.log('handleChange: START with ',event);
        console.log('handleChange: event details ',event.detail.checked);
        this._status = event.detail.checked || false;

        const changeEvent = new FlowAttributeChangeEvent('status', this._status);
        console.log('handleChange: attributeChangeEvent prepared ',changeEvent);
        this.dispatchEvent(changeEvent);

        /*const changeEvent2 = new FlowAttributeChangeEvent('Status', this._status);
        console.log('handleChange: attributeChangeEvent 2 prepared ',changeEvent2);
        this.dispatchEvent(changeEvent2);*/

        console.log('handleChange: END');
    }
}