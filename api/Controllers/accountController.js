const Account = require("../../DB/models/accountModel");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
require("dotenv").config();

//email,password,name
exports.post_register = (req, res, next) => {
    console.log(req.body);
  Account.find({ email: req.body.email.trim() })
    .exec()
    .then((accountRes) => {
      if (accountRes.length >= 1) {
        res.status(409).json({
          status: "Error",
          Code: "AC0001",
        });
      } else {
        bcrypt
          .hash(req.body.password, 10)
          .then((hash) => {
            const account = Account({
              _id: mongoose.Types.ObjectId(),
              email: req.body.email.trim(),
              name: req.body.name.trim(),
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
      name: account.name,
      role: account.role,
    };
  };

  Account.find({ email: req.body.email.trim() })
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
                  expiresIn: "3h",
                },
                (err, token) => {
                  req.session.user = getAccountData(accountRes[0]);
                  req.session.cookie.maxAge = 3 * 60 * 60 * 1000;

                  res.cookie("token", token, {
                    maxAge: 3 * 60 * 60 * 1000,
                    httpOnly: true,
                  });

                  return res.status(200).json({
                      status:"Success",
                      account: getAccountData(accountRes[0])
                  }).end()
                }
              );
            } else {
                return res.status(401).json({
                    status: "Error",
                    code: "AC0011"
                })
            }
          }
        );
      } else {
          return res.status(401).json({
              status: "Error",
              code: "AC0012"
          })
      }
    })
    .catch((err) => {
        return res.status(500).json({
            status: "Error",
              code: "AC0013"
        })
    });
};


exports.get_auth = (req,res,next) => {
    if(req.session.user){
        return res.status(200).json({
            status: "Success",
            account: req.session.user
        })
    } else {
        return res.status(401).json({
            status: "Error",
            code: "AC0021"
        })
    }
}


exports.get_logout = (req,res,next) => {
    if(req.session){
        req.session.destroy();
        res.clearCookie();
        return res.status(200).json({
            status: "Success",
            message: "logouted"
        }).end();
    }


}