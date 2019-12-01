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
        text: `Thank you for confirming your email with Myriade. 
        Here your email confirmation token used for creating an account:
        ${tok} Thank you.`,
        html: `
        <div>
          <h4>Thank you for confirming your email with Myriade. </h4>
          <p>Here your email confirmation token used for creating an account: <strong>${tok} </strong></p>
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
