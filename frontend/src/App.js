import React, { useEffect, useState } from "react";

function App() {
  const [events, setEvents] = useState([]);

  // popup states
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);

  // 🔹 fetch events from Render backend
  useEffect(() => {
    fetch("https://sydney-event-platform-bj4c.onrender.com/events")
      .then((res) => res.json())
      .then((data) => setEvents(data))
      .catch((err) => console.error(err));
  }, []);

  // GET TICKETS click
  const handleGetTickets = (event) => {
    setSelectedEvent(event);
  };

  // submit email + consent
  const submitLead = async () => {
    if (!email || !consent) {
      alert("Email aur consent dono zaroori hain");
      return;
    }

    try {
      await fetch(
        "https://sydney-event-platform-bj4c.onrender.com/leads",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email,
            consent,
            eventId: selectedEvent._id,
          }),
        }
      );

      alert("Thank you! Redirecting to event page…");

      // ✅ redirect to ORIGINAL EVENT URL
      window.location.href =
        selectedEvent.eventUrl || "https://www.eventbrite.com";
    } catch (err) {
      alert("Something went wrong");
      console.error(err);
    }

    // reset popup state
    setSelectedEvent(null);
    setEmail("");
    setConsent(false);
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h1>Sydney Events</h1>

      {events.length === 0 && <p>No events found</p>}

      {events.map((event) => (
        <div
          key={event._id}
          style={{
            border: "1px solid #ccc",
            padding: "15px",
            marginBottom: "12px",
            borderRadius: "6px",
          }}
        >
          <h3>{event.title}</h3>

          <p>
            <b>Date:</b>{" "}
            {new Date(event.dateTime).toLocaleString()}
          </p>

          <p>
            <b>Venue:</b> {event.venueName}
          </p>

          <p>{event.description}</p>

          <small>Source: {event.sourceName}</small>

          <br />

          <button
            onClick={() => handleGetTickets(event)}
            style={{
              marginTop: "10px",
              padding: "8px 14px",
              backgroundColor: "#ff5a5f",
              color: "#fff",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            GET TICKETS
          </button>
        </div>
      ))}

      {/* ================= POPUP MODAL ================= */}
      {selectedEvent && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0,0,0,0.6)",
          }}
        >
          <div
            style={{
              background: "#fff",
              width: "320px",
              margin: "120px auto",
              padding: "20px",
              borderRadius: "8px",
            }}
          >
            <h3>Get Tickets</h3>

            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                width: "100%",
                padding: "8px",
                marginBottom: "10px",
              }}
            />

            <label>
              <input
                type="checkbox"
                checked={consent}
                onChange={(e) => setConsent(e.target.checked)}
              />{" "}
              I agree to receive updates
            </label>

            <br />
            <br />

            <button
              onClick={submitLead}
              style={{
                padding: "8px 12px",
                background: "#000",
                color: "#fff",
                border: "none",
                borderRadius: "4px",
              }}
            >
              Continue
            </button>

            <button
              onClick={() => setSelectedEvent(null)}
              style={{
                padding: "8px 12px",
                marginLeft: "10px",
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
      {/* =============================================== */}
    </div>
  );
}

export default App;