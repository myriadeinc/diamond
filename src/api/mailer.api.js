'use strict';
const config = require('src/util/config.js');

class MailerAPI {

    /**
     * @param {string} apiKey 
     */
    constructor(apiKey=null) {
        this.sgMail = require('@sendgrid/mail');
        this.sgMail.setApiKey(apiKey ? apiKey : config.get('mail:sendgrid_key'));
    }

    /**
     * @param {string} recipient
     * @param {object} message
     */
    async send(recipient, message){
        // TO-DO: Email validaiont for recipient
        const msg = {
            to: recipient,
            from: 'no-reply@myriade.io',
            subject: "VOID",
            text: "VOID",
            html:"",
            ...message
        }
        if ('local' === config.get('NODE_ENV')){
            
        }
        else {
            await this.sgMail.send(msg);
        }
    }
}

export default MailerAPI;