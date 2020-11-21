const mongoose = require("mongoose");


const hotActSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: { type: String, required: true },
    info: { type: String,  },
    dueDate: {type: Date, required: true},
    createrId: { type: mongoose.Schema.Types.ObjectId, ref: "Account" },
    activityId: { type: mongoose.Schema.Types.ObjectId, required: true },
    crDate: { type: Date, default: Date.now }
})

module.exports = mongoose.model("HotAct", hotActSchema);