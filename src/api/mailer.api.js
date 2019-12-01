const config = require('src/util/config.js');

/**
 * Mailer API Class
 */
class MailerAPI {
  /**
   * @param {string} apiKey
   */
  constructor() {
    this.sgMail = require('@sendgrid/mail');
    this.sgMail.setApiKey(config.get('mail:sendgrid_key'));
  }

  /**
   * @param {string} recipient
   * @param {object} message
   */
  async send(recipient, message) {
    // TO-DO: Email validaiont for recipient
    const msg = {
      to: recipient,
      from: 'no-reply@myriade.io',
      subject: '',
      text: '',
      html: '',
      ...message,
    };
    if (config.get('mail:enable')) {
      await this.sgMail.send(msg);
    } else {
      console.log(msg);
    }
  }
};

module.exports = MailerAPI;
