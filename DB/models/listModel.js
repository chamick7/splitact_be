const mongoose = require('mongoose');


const listSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    listName: { type: String, required: true },
    createrId: { type: mongoose.Schema.Types.ObjectId, required: true, ref:"Account" },
    activityId: { type: mongoose.Schema.Types.ObjectId, required: true, ref:"Activity" },
    cards: [
        { type: mongoose.Schema.Types.ObjectId, ref: "Card" }
    ],
    type: { type: String, default: "Manual"},
    crDate: { type: Date, default: Date.now }
})  


module.exports = mongoose.model("List", listSchema);