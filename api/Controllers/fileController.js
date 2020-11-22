const multer = require("multer");
const Account = require("../../DB/models/accountModel");

const imgStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/img");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const uploadImg = multer({ storage: imgStorage }).single("file");

exports.post_uploadFile = (req, res, next) => {};

exports.post_uploadProfile = (req, res, next) => {
  uploadImg(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      return res.status(500).json(err);
    } else if (err) {
      return res.status(500).json(err);
    } else {
      const imgPath =
        "http://localhost:5000/img/" + req.accountData.acID + ".jpg";
      req.session.user.img = imgPath;
      Account.findOneAndUpdate(
        { _id: req.accountData.acID },
        {
          img: imgPath,
        },
        { new: true }
      )
        .then((result) => {
          return res.status(200).json({
            status: "Success",
            img: imgPath,
          });
        })
        .catch((err) => {
          return res.status(400).json({
            status: "Error",
          });
        });
    }
  });
};
