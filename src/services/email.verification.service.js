const MailerApi = require('src/api/mailer.api.js');

const logger = require('src/util/logger.js').account;
const AccountService = require('src/services/accounts.service.js');
const randtoken = require('rand-token').generator({
  chars: 'A-Z'
});

const mailer = new MailerApi();

const cache = require('src/util/cache.js')

const EmailVerificationService = {

  verifyEmail: async (email) => {
    const tok = randtoken.generate(10);
    try {
      const exists = await AccountService.emailExists(email);
      if (exists) {
        return false;
      }

      await cache.put(tok, email, 'Email::Confirmation');
      await mailer.send(email, {
        subject: 'Confirm your email',
        text: `Thank you for registrating your e-mail on Myriade. Please click on the link below to confirm your e-mail and proceed with account creation: 
        https://myriade.io/#/signup?token=${tok}
        
        If you did not request an account creation on Myriade, feel free to ignore this e-mail
        Thank you!`,
        html: `
        <div>
          <h5>Thank you for registrating your e-mail on Myriade. Please click on the link below to confirm your e-mail and proceed with account creation</h5>
          <p>If you did not request an account creation on Myriade, feel free to ignore this e-mail</p>
          <table width="100%" cellspacing="0" cellpadding="0">
            <tr>
                <td>
                    <table cellspacing="0" cellpadding="0">
                        <tr>
                            <td style="border-radius: 2px;" bgcolor="#DE5100">
                                <a href="https://myriade.io/#/signup?token=${tok}" target="_blank" style="padding: 8px 12px; border: 1px solid #DE5100;border-radius: 2px;font-family: Helvetica, Arial, sans-serif;font-size: 14px; color: #ffffff;text-decoration: none;font-weight:bold;display: inline-block;">
                                    Confirm your e-mail       
                                </a>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
          </table>
          <p>Thank you!</p>
        </div>
        `
      });
      return true;
    } catch (err) {
      logger.error(err);
      await cache.delete(tok, 'Email::Confirmation');
      return false;
    }
  },
};

module.exports = EmailVerificationService;
