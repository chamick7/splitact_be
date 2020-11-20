const mongoose = require("mongoose");

const memberSchema = mongoose.Schema({
    _id: { type: mongoose.Schema.Types.ObjectId, required: true },
    acId: { type: mongoose.Schema.Types.ObjectId, required: true, ref:"Account" },
    atId: { type: mongoose.Schema.Types.ObjectId, required: true, ref:"Activity" },
    joinDate: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Member", memberSchema);
