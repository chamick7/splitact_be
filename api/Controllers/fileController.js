const multer = require("multer");
const Account = require("../../DB/models/accountModel");
const Card = require("../../DB/models/cardModel");
const path = require("path");

const imgStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/img");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
const uploadImg = multer({ storage: imgStorage }).single("file");

exports.post_uploadFile = (req, res, next) => {
  const path = "http://localhost:5000/file/";
  const cardId = req.body.cardId;

  let fileSave = req.files.map((file) => path + file.originalname);

  console.log(fileSave);

  Card.findOneAndUpdate(
    { _id: cardId },
    { $push: { files: fileSave } },
    { new: true }
  )
    .then((result) => {
      return res.status(201).json({
        status: "Success",
        files: result.files,
      });
    })
    .catch((err) => {
      console.log(err);
      return res.status(400).json({
        status: "Error",
        code: "AT0045",
      });
    });
};

exports.post_uploadProfile = (req, res, next) => {
  uploadImg(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      return res.status(500).json(err);
    } else if (err) {
      return res.status(500).json(err);
    } else {
      const imgPath =
        "https://api.splitact.com/img/" + req.accountData.acID + ".jpg";
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

exports.get_dowload = (req, res, next) => {
  const fileName = req.params.fileName;

  res.download(path.join(__basedir, "/public/file/", fileName), (err) => {
    res.status(404).send("404 not found");
  });
};
