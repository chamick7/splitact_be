const Account = require("../../DB/models/accountModel");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const moment = require("../../utils/moment");
const mailer = require("../../utils/mailer");

//email,password,name
exports.post_register = (req, res, next) => {
  console.log(req.body);
  Account.find({
    $or: [
      { username: req.body.username.trim() },
      { email: req.body.email.trim() },
    ],
  })
    .exec()
    .then((accountRes) => {
      if (accountRes.length >= 1) {
        if (accountRes[0].username === req.body.username.trim()) {
          res.status(409).json({
            status: "Error",
            Code: "AC0001",
            already: "username",
          });
        } else if (accountRes[0].email === req.body.email.trim()) {
          res.status(409).json({
            status: "Error",
            Code: "AC0001",
            already: "email",
          });
        }
      } else {
        bcrypt
          .hash(req.body.password, 10)
          .then((hash) => {
            console.log(moment.dateThai());
            const account = Account({
              _id: mongoose.Types.ObjectId(),
              email: req.body.email.trim(),
              username: req.body.username.trim(),
              password: hash,
            });

            account
              .save()
              .then(() => {
                res.status(201).json({
                  status: "Success",
                });
              })
              .catch((err) => {
                console.log(err);
                res.status(500).json({
                  status: "Error",
                  code: "AC0003",
                });
              });
          })
          .catch((err) => {
            res.status(500).json({
              status: "Error",
              err: err,
            });
          });
      }
    })
    .catch();
};

//email,password
exports.post_login = (req, res, next) => {
  const getAccountData = (account) => {
    return {
      acID: account._id,
      email: account.email,
      username: account.username,
      role: account.role,
      img: account.img,
    };
  };

  Account.find({
    $or: [
      { email: req.body.emailOrUsername.trim() },
      { username: req.body.emailOrUsername.trim() },
    ],
  })
    .exec()
    .then((accountRes) => {
      if (accountRes.length >= 1) {
        bcrypt.compare(
          req.body.password,
          accountRes[0].password,
          (err, result) => {
            if (result) {
              jwt.sign(
                getAccountData(accountRes[0]),
                process.env.JWT_SECRET,
                {
                  expiresIn: "12h",
                },
                (err, token) => {
                  req.session.user = getAccountData(accountRes[0]);
                  req.session.cookie.maxAge = 12 * 60 * 60 * 1000;

                  res.cookie("token", token, {
                    maxAge: 12 * 60 * 60 * 1000,
                    httpOnly: true,
                  });

                  return res
                    .status(200)
                    .json({
                      status: "Success",
                      account: getAccountData(accountRes[0]),
                    })
                    .end();
                }
              );
            } else {
              return res.status(401).json({
                status: "Error",
                code: "AC0011",
              });
            }
          }
        );
      } else {
        return res.status(401).json({
          status: "Error",
          code: "AC0012",
        });
      }
    })
    .catch((err) => {
      return res.status(500).json({
        status: "Error",
        code: "AC0013",
      });
    });
};

exports.get_auth = (req, res, next) => {
  if (req.session.user) {
    return res.status(200).json({
      status: "Success",
      account: req.session.user,
    });
  } else {
    return res.status(401).json({
      status: "Error",
      code: "AC0021",
    });
  }
};

exports.get_logout = (req, res, next) => {
  if (req.session) {
    req.session.destroy();
    res.clearCookie();
    res.redirect("/");
  }
};

exports.get_account = (req, res, next) => {
  const acId = req.accountData.acID;

  Account.findOne({ _id: acId })
    .select("-password -__v -reg_date")
    .then((account) => {
      return res.status(200).json({
        status: "Success",
        account: account,
      });
    })
    .catch((err) => {
      return res.status(400).json({
        status: "Error",
        code: "AC0013",
      });
    });
};

exports.get_users = (req, res, next) => {
  Account.find({ _id: { $ne: req.accountData.acID } })
    .select("_id username img")
    .then((data) => {
      if (data.length >= 1) {
        res.status(200).json({
          status: "Success",
          users: data,
        });
      } else {
        res.status(404).json({
          status: "Error",
          code: "AC0062",
        });
      }
    })
    .catch((err) => {
      res.status(500).json({
        status: "Error",
        code: "AC0061",
      });
    });
};

//email
exports.post_forgetPW_sendToken = (req, res, next) => {
  Account.find({ email: req.body.email.trim() })
    .then((accountRes) => {
      if (accountRes.length >= 1) {
        jwt.sign(
          { header: "Reset pw", email: accountRes[0].email },
          process.env.JWT_SECRET,
          { expiresIn: "10m" },
          (err, token) => {
            // console.log(mailer.sendMail(accountRes[0].email, token ));
            mailer.sendMail(accountRes[0].email, accountRes[0].username, token);
            return res.status(200).json({
              status: "Success",
            });

            // return res.status(200).json({
            //   status: "Success",
            //   rsToken: token,
            // });
          }
        );
      } else {
        return res.status(404).json({
          status: "Error",
          code: "AC0012",
        });
      }
    })
    .catch((err) => {
      return res.status(500).json({
        status: "Error",
        code: "AC0013",
      });
    });
};

//rwToken
exports.get_forgetPW_recieveToken = (req, res, next) => {
  try {
    const decode = jwt.verify(req.query.rstoken, process.env.JWT_SECRET);

    res.status(200).json({
      status: "Success",
      email: decode.email,
    });
  } catch (error) {
    res.status(406).json({
      status: "Error",
      code: "AC0041",
    });
  }
};

//rwToken, password
exports.post_forgetPW_resetPassword = (req, res, next) => {
  try {
    const decode = jwt.verify(req.body.rsToken, process.env.JWT_SECRET);

    bcrypt.hash(req.body.password, 10).then((hash) => {
      Account.findOneAndUpdate({ email: decode.email }, { password: hash })
        .then(() => {
          return res.status(200).json({
            status: "Success",
          });
        })
        .catch((err) => {
          return res.status(500).json({
            status: "Error",
            code: "AC0051",
          });
        });
    });
  } catch (error) {
    res.status(406).json({
      status: "Error",
      code: "AC0041",
    });
  }
};

//old_password, new_password
exports.post_changePassword = (req, res, next) => {
  const acId = req.accountData.acID;
  const oldPassword = req.body.old_password;
  const newPassword = req.body.new_password;

  Account.findOne({ _id: acId })
    .then((account) => {
      bcrypt.compare(oldPassword, account.password, (err, result) => {
        if (result) {
          bcrypt
            .hash(newPassword, 10)
            .then((hash) => {
              Account.updateOne({ _id: acId }, { password: hash })
                .then((updateResult) => {
                  req.session.destroy();
                  res.clearCookie();
                  res.redirect("/");
                  return res.status(200).json({
                    status: "Success",
                  });
                })
                .catch((err) => {
                  return res.status(400).json({
                    status: "Error",
                    code: "AC0003",
                  });
                });
            })
            .catch((err) => {
              return res.status(500).json({
                status: "Error",
                code: "AC0002",
              });
            });
        } else {
          return res.status(400).json({
            status: "Error",
            code: "AC0004",
          });
        }
      });
    })
    .catch((err) => {
      return res.status(404).json({
        status: "Error",
        code: "AC0012",
      });
    });
};
