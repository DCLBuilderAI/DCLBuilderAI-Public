const mailgun = require('mailgun-js');
const DOMAIN = 'replies.rentparcel.io';

const sendEmail = async options => {
  // 1) Create a transporter
 const mg = mailgun({
	   apiKey: "<enter mailgun key here>",
	   domain: DOMAIN
  });

 let from = "DCLBuilderAI <noreply@dclbuilderai.com>";
 if(options.from) {
   from = options.from
 }

 const data = {
	  from: from,
	  to: options.email,
	  subject: options.subject,
    html: options.html
 };

  // 3) Actually send the email
  mg.messages().send(data)
    .then(res => console.log(res))
    .catch(err => console.log(err));
};

module.exports = sendEmail;
