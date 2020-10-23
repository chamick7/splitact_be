const mongoose = require('mongoose');
const moment = require("moment-timezone");
const dateThailand = moment.tz(Date.now(),"Asia/Bangkok");



const accountSchema = mongoose.Schema({
    _id:mongoose.Schema.Types.ObjectId,
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    role: { type: String, default: 'member' },
    reg_date: { type: Date, default: dateThailand },

})


module.exports = mongoose.model('Account',accountSchema);