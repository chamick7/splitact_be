const nodemailer = require("nodemailer");

module.exports.sendMail = (email, rsToken) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.MAILER_EMAIL,
      pass: process.env.MAILER_PASSWORD,
    },
  });

  const ejs = require("ejs");

  ejs.renderFile(
    __dirname + "/resetpassword.ejs",
    { email: email, rsToken: rsToken },
    (err, res) => {
      if (err) {
        console.log(err);
      } else {
        transporter.sendMail(
          {
            from: process.env.MAILER_EMAIL,
            to: email,
            subject: `Reset password [${email}]`,
            html: res
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
