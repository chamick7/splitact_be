const nodemailer = require("nodemailer");
const ejs = require("ejs");

module.exports.sendMail = (email, name, rsToken) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.MAILER_EMAIL_SERVICE,
      pass: process.env.MAILER_SERVICE_PASSWORD,
    },
  });

  ejs.renderFile(
    __dirname + "/resetpassword/resetpassword.ejs",
    { email: email, name: name, rsToken: rsToken },
    (err, res) => {
      if (err) {
        console.log(err);
      } else {
        transporter.sendMail(
          {
            from: process.env.MAILER_EMAIL_SERVICE,
            to: email,
            subject: `Reset password [${email}]`,
            html: res,
          },
          (err, res) => {
            if (res) {
              return true;
            } else if (err) {
              return false;
            }
          }
        );
      }
    }
  );
};

module.exports.sendContact = (email, name, subject, data) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.MAILER_EMAIL_CONTACT,
      pass: process.env.MAILER_CONTACT_PASSWORD,
    },
  });

  ejs.renderFile(
    __dirname + "/contact/contact.ejs",
    { email: email, name: name, data: data },
    (err, res) => {
      if (err) {
        console.log(err);
      } else {
        transporter.sendMail(
          {
            from: process.env.MAILER_EMAIL_CONTACT,
            to: email,
            subject: `Thank you for getting in touch`,
            html: res,
          },
          (err, res) => {
            if (res) {
              return true;
            } else {
              return false;
            }
          }
        );
      }
    }
  );
};
