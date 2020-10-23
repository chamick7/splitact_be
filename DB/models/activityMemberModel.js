const mongoose = require("mongoose");
const { schema } = require("./activityModel");

const moment = require("moment-timezone");
const dateThailand = moment.tz(Date.now(),"Asia/Bangkok");

const activityMemberSchema = mongoose.Schema({

    _id: mongoose.Schema.Types.ObjectId,
    acID: { type: String, required: true },
    atID: { type: String, required: true },
    cr_date: { type: Date, default: dateThailand }

})


module.exports = mongoose.model('ActivityMember',activityMemberSchema);