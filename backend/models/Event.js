const mongoose = require("mongoose");

const EventSchema = new mongoose.Schema({
  title: String,
  dateTime: Date,
  venueName: String,
  city: String,
  description: String,
  sourceName: String,

  
  eventUrl: String,

  status: {
    type: String,
    default: "new",
  },
}, { timestamps: true });

module.exports = mongoose.model("Event", EventSchema);