const mongoose = require("mongoose");
const moment = require("../../utils/moment");
const dateThai = moment.dateThai();

const accountSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  username: { type: String, required: true },
  email: { type: String, required: true },
  name: { type: String },
  tel: { type: String },
  img: { type: String, default: "http://api.splitact.com/img/user.png" },
  password: { type: String, required: true },
  role: { type: String, default: "member" },
  reg_date: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Account", accountSchema);
