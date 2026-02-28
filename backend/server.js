const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

/* =========================
   MongoDB Connection
========================= */
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err.message);
  });

/* =========================
   Models
========================= */
const Event = require("./models/Event");
const Lead = require("./models/Lead");

/* =========================
   Routes
========================= */

// Health check
app.get("/", (req, res) => {
  res.send("Backend running successfully");
});

// Add dummy event (for testing)
app.get("/add-dummy", async (req, res) => {
  try {
    const event = await Event.create({
      title: "Sydney Tech Meetup",
      dateTime: new Date(),
      venueName: "Sydney Opera House",
      city: "Sydney",
      description: "A dummy event for testing",
      sourceName: "Eventbrite",
      eventUrl: "https://www.eventbrite.com",
      status: "new"
    });

    res.json(event);
  } catch (error) {
    console.error("ADD DUMMY ERROR:", error);
    res.status(500).json({ message: "Failed to add dummy event" });
  }
});

// Fetch all events (SAFE)
app.get("/events", async (req, res) => {
  try {
    const events = await Event.find();
    res.json(events);
  } catch (error) {
    console.error("FETCH EVENTS ERROR:", error);
    res.status(500).json({
      message: "Failed to fetch events",
      error: error.message
    });
  }
});

// Save lead (email + consent)
app.post("/leads", async (req, res) => {
  try {
    const { email, consent, eventId } = req.body;

    if (!email || !consent) {
      return res.status(400).json({
        message: "Email & consent required"
      });
    }

    const lead = await Lead.create({
      email,
      consent,
      eventId
    });

    res.json(lead);
  } catch (error) {
    console.error("LEAD SAVE ERROR:", error);
    res.status(500).json({
      message: "Failed to save lead"
    });
  }
});

/* =========================
   Server Start
========================= */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});