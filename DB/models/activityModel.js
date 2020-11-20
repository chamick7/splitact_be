const mongoose = require("mongoose");

const moment = require("../../utils/moment");
const dateThai = moment.dateThai();

const activitySchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  atName: { type: String, required: true },
  list: [
    { type: mongoose.Schema.Types.ObjectId, ref: "List" }
  ],
  atCreaterID: { type: mongoose.Schema.Types.ObjectId, required: true, ref:"Account" },
  color: { type: String, required: true },
  crDate: { type: Date, default: Date.now },
  dueDate: {type: Date, default:null},
});

module.exports = mongoose.model("Activity", activitySchema);
