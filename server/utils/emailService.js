const sgMail = require('@sendgrid/mail');

// We configure this with the API key from environment variables
if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
}

const sendEmail = async (options) => {
  if (!process.env.SENDGRID_API_KEY || !process.env.EMAIL_FROM) {
    console.error('SendGrid API Key or EMAIL_FROM is missing. Emails will NOT be sent.');
    // Fallback: Just log the email contents so development can continue without keys
    console.log(`[SIMULATED EMAIL] To: ${options.to} | Subject: ${options.subject}`);
    console.log(`[SIMULATED EMAIL] HTML: ${options.html}`);
    return;
  }

  const msg = {
    to: options.to,
    from: process.env.EMAIL_FROM,
    subject: options.subject,
    html: options.html,
  };

  try {
    await sgMail.send(msg);
    console.log(`Email sent to ${options.to}`);
  } catch (error) {
    console.error('Error sending email via SendGrid:', error);
    if (error.response) {
      console.error(error.response.body);
    }
  }
};

module.exports = sendEmail;
