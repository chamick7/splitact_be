const mongoose = require("mongoose");

const moment = require("moment-timezone");
const dateThailand = moment.tz(Date.now(),"Asia/Bangkok");




const activitySchema = mongoose.Schema({
    
    _id: mongoose.Schema.Types.ObjectId,
    atName: { type: String, required: true },
    atCreaterID: { type: String, required: true },
    crDate: { type: Date, default: dateThailand }

})



module.exports = mongoose.model('Activity',activitySchema);