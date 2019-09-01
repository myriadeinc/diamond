const MailerApi = require('src/api/mailer.api.js');

const logger = require('src/util/logger.js').account;
const AccountService = require('src/services/accounts.service.js');
const encryption = require('src/util/encryption.js');

const EmailVerificationService = {

    verifyEmail : async (email) => {
        const exists = await AccountService.emailExists(email);
        if (!exists){
            const confirmStr = await encryption.encrypt(email);
            console.log(confirmStr);
            // await MailerApi.send({
            //     text:`confirm your email by clicking this link ${}`
            // })
        }
        else {
            logger.info(`email ${email} already exists`);
            return;
        }
    }
}

module.exports = EmailVerificationService;