const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log("Mongo error:", err));

app.get("/", (req, res) => {
  res.send("Backend running successfully");
});

const Event = require("./models/Event");
const Lead = require("./models/Lead");

// 🔥 Dummy event with REAL source URL
app.get("/add-dummy", async (req, res) => {
  const event = await Event.create({
    title: "Sydney Tech Meetup",
    dateTime: new Date(),
    venueName: "Sydney Opera House",
    city: "Sydney",
    description: "A dummy event for testing",
    sourceName: "Eventbrite",

    // ✅ IMPORTANT: original event page
    eventUrl: "https://www.eventbrite.com"
  });

  res.json(event);
});

// Fetch all events
app.get("/events", async (req, res) => {
  const events = await Event.find();
  res.json(events);
});

// Save lead (email + consent)
app.post("/leads", async (req, res) => {
  const { email, consent, eventId } = req.body;

  if (!email || !consent) {
    return res.status(400).json({ message: "Email & consent required" });
  }

  const lead = await Lead.create({ email, consent, eventId });
  res.json(lead);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});