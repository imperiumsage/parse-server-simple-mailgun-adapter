
var Mailgun = require('mailgun-js');

var SimpleMailgunAdapter = mailgunOptions => {
  if (!mailgunOptions || !mailgunOptions.apiKey || !mailgunOptions.domain || !mailgunOptions.fromAddress) {
    throw 'SimpleMailgunAdapter requires an API Key, domain, and fromAddress.';
  }
  var mailgun = Mailgun(mailgunOptions);

  var sendMail = mail => {
    var data = {
      from: mailgunOptions.fromAddress,
      to: mail.to,
      subject: mail.subject,
      text: mail.text,
    }

    return new Promise((resolve, reject) => {
      mailgun.messages().send(data, (err, body) => {
        if (typeof err !== 'undefined') {
          reject(err);
        }
        resolve(body);
      });
    });
  }

  var sendVerificationEmail = options => {
    var mail = {};
    mail.text = "Hi,\n\n" +
        "You are being asked to confirm the e-mail address " + options.user.get("email") + " with " + options.appName + "\n\n" +
        "" +
        "Click here to confirm it:\n" + options.link;
    mail.to = options.user.get("email");
    mail.subject = 'Please verify your e-mail for ' + options.appName;
    sendMail(mail);
    
  }

  var sendPasswordResetEmail = options => {
    var mail = {};
    mail.text = "Hi,\n\n" +
        "Someone (hopefully you) requested to reset your password for " + options.appName + ".\n\n" +
        "" +
        "Click here to reset it:\n" + options.link;
    mail.to = options.user.get("email");
    mail.subject =  'Password Reset for ' + options.appName;
    sendMail(mail);

  }

  return Object.freeze({
    sendMail: sendMail,
    sendVerificationEmail: sendVerificationEmail,
    sendPasswordResetEmail: sendPasswordResetEmail
  });
}

module.exports = SimpleMailgunAdapter
