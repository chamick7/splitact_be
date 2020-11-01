const mongoose = require("mongoose");
const moment = require("../../utils/moment");
const dateThai = moment.dateThai();



const accountSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  activities: [
    {
      atID: { type: mongoose.Schema.Types.ObjectId, ref:'Activity' },
      joinDate: { type: Date, default: dateThai }
    }
  ],
  role: { type: String, default: "member" },
  reg_date: { type: Date, default: dateThai },
});

module.exports = mongoose.model("Account", accountSchema);
