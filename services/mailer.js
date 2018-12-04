const nodemailer = require("nodemailer");

module.exports = {
  async sendMail(email, apiKey) {
    // mail SMTP settings
    const transporter = await nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USERNAME,
        pass: process.env.GMAIL_PASSWORD
      }
    });

    // email content
    const mailOptions = {
      from: `"avatarMate API 📸" <${process.env.GMAIL_USERNAME}>`, // sender address
      to: `${email}`, // list of receivers
      subject: "Your API key 🔑", // Subject line
      text: `Thank you for registering an account with avatarMate API! Your email is: ${email}. Your api key is: ${apiKey}`, // plain text body
      html: `<p>Thank you for registering an account with avatarMate API!</p>
      <div style='margin-top:10px'>
        <p>Your account details are below:</p>
        <p style='margin-left:15px'>Email: ${email}</p>
        <p style='margin-left:15px'>API Key: <span style='color:green'>${apiKey}</span></p>
      </div>
      ` // html body
    };

    // send mail with defined transport object
    await transporter.sendMail(mailOptions, (error, info) => {
      if (error) return console.log(error);
    });
  }
};
