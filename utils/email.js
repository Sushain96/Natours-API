const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  //     1. Create a transporter
  var transporter = nodemailer.createTransport({
    host: 'smtp.mailtrap.io',
    port: 2525,
    auth: {
      user: 'f85af1adee556f',
      pass: '676fb4ca992a02',
    },
  });
  // const transporter = nodemailer.createTransport({
  //   host: process.env.EMAIL_HOST,
  //   port: process.env.EMAIL_PORT,
  //   auth: {
  //     username: process.env.EMAIL_USERNAME,
  //     password: process.env.EMAIL_PASSWORD,
  //   },
  // });
  //  2. define the email options
  const mailOptions = {
    from: 'SUSHAIN <sushain@gmail.com>',
    to: options.email,
    subject: options.subject,
    text: options.message,
  };
  // 3. Actually send the email
  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
