const mailer = require("../../utils/mailer");

//email, name, subject, data
exports.post_sendContact = (req, res, next) => {
  const email = req.body.email;
  const name = req.body.name;
  const subject = req.body.subject;
  const data = req.body.data;

  mailer.sendContact(email, name, subject, data);
  return res.status(200).json({
    status: "Success",
  });
};
