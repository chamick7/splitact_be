const mongoose = require("mongoose");

const cardSchema = mongoose.Schema({
  _id: { type: mongoose.Schema.Types.ObjectId, required: true },
  cardName: { type: String, required: true },
  cardDescription: { type: String },
  color: { type: String, required: true },
  listId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "List" },
  files: [String],
  workerId: { type: mongoose.Schema.Types.ObjectId, ref: "Account" },
  createrId: { type: mongoose.Schema.Types.ObjectId, ref: "Account" },
  dueDate: { type: Date, default: null },
  crDate: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Card", cardSchema);
