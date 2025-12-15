import { useEffect } from "react";
import { db } from "./firebase";
import { collection, addDoc, Timestamp } from "firebase/firestore";

const GOOGLE_FORM_URL =
  "https://docs.google.com/forms/d/e/1FAIpQLSda2i-iQZi-tFrHnFONNe1ZmD2XQDczAdRVz63gAXDj2SPWGQ/viewform";

const REG_ID_ENTRY = "entry.763208852";
const NAME_ENTRY = "entry.1567985868";

const inputStyle = {
  width: "100%",
  padding: "12px 14px",
  borderRadius: "8px",
  border: "1px solid #ccc",
  fontSize: "14px",
  outline: "none",
  boxSizing: "border-box"
};

export default function PlayerRegistration() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("thankyou") === "true") {
      alert("Thank you! Your registration and document submission is complete.");
      window.history.replaceState({}, document.title, "/");
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const f = e.target;

      const registrationNumber = "2026" + String(Date.now()).slice(-6);

      await addDoc(collection(db, "players"), {
        registrationNumber,
        name: f.name.value,
        dob: f.dob.value,
        mobile: f.mobile.value,
        email: f.email.value,
        address: f.address.value,
        teamType: f.teamType.value,
        playerType: f.playerType.value,
        teamName: f.teamName.value || "Any Team",
        paymentStatus: "Pending",
        documents: "Uploaded via Google Form",
        createdAt: Timestamp.now()
      });

      alert(
        `Registration successful!\n\nRegistration Number:\n${registrationNumber}`
      );

      const redirectUrl =
        GOOGLE_FORM_URL +
        "?" +
        REG_ID_ENTRY +
        "=" +
        encodeURIComponent(registrationNumber) +
        "&" +
        NAME_ENTRY +
        "=" +
        encodeURIComponent(f.name.value);

      window.open(redirectUrl, "_blank");
      f.reset();
    } catch (err) {
      console.error(err);
      alert("Submission failed. Please try again.");
    }
  };

  return (
    <div style={{ background: "#f4f6f9", minHeight: "100vh", padding: "30px" }}>
      <form
        onSubmit={handleSubmit}
        style={{
          maxWidth: "720px",
          margin: "auto",
          background: "#ffffff",
          padding: "35px",
          borderRadius: "14px",
          boxShadow: "0 10px 25px rgba(0,0,0,0.08)"
        }}
      >
        {/* HEADER */}
        <div style={{ textAlign: "center", marginBottom: "30px" }}>
          <img
            src="/lccia-logo.png"
            alt="LCCIA Logo"
            style={{ height: "120px", marginBottom: "16px" }}
          />
          <h2 style={{ margin: 0 }}>LCCIA Sports League – 2026</h2>
          <h3 style={{ margin: "6px 0", fontWeight: "normal", color: "#555" }}>
            Player Registration Form
          </h3>
          <p style={{ color: "#777" }}>
            9 Jan (Friday) to 11 Jan (Sunday)
          </p>
        </div>

        {/* INPUTS */}
        <label>Full Name</label>
        <input name="name" style={inputStyle} required />
        <br /><br />

        <label>Date of Birth</label>
        <input type="date" name="dob" style={inputStyle} required />
        <br /><br />

        <label>Mobile Number</label>
        <input name="mobile" style={inputStyle} required />
        <br /><br />

        <label>Email Address</label>
        <input type="email" name="email" style={inputStyle} required />
        <br /><br />

        <label>Address</label>
        <textarea name="address" rows="3" style={inputStyle} required />
        <br /><br />

        <label>Team Type</label>
        <select name="teamType" style={inputStyle} required>
          <option value="">Select Team Type</option>
          <option value="Pro">Pro</option>
          <option value="Family">Family</option>
        </select>
        <br /><br />

        <label>Player Type</label>
        <select name="playerType" style={inputStyle} required>
          <option value="">Select Player Type</option>
          <option>Batsman</option>
          <option>Bowler</option>
          <option>Wicket Keeper</option>
          <option>All Rounder</option>
        </select>
        <br /><br />

        <label>Team Name (optional)</label>
        <input name="teamName" style={inputStyle} />
        <br /><br />

        {/* CHARGES – UPDATED */}
        <div
          style={{
            background: "#fff3e8",
            padding: "16px",
            borderRadius: "10px",
            marginBottom: "16px"
          }}
        >
          <strong>Next Step – Player Charges</strong>
<p style={{ marginTop: "6px" }}>
  Pro Player: ₹750 per player<br />
  Family Player: ₹300 per player
</p>

          <em>
            Payment gateway details will be shared after submission of interest.
          </em>
        </div>

        {/* DOCUMENTS */}
        <div
          style={{
            background: "#eef3f8",
            padding: "16px",
            borderRadius: "10px"
          }}
        >
          <strong>Document Upload</strong>
          <ul>
            <li>Player Photo</li>
            <li>Aadhaar Card</li>
            <li>Caste Certificate</li>
          </ul>
        </div>

        <br />

        <button
          type="submit"
          style={{
            width: "100%",
            padding: "14px",
            backgroundColor: "#D05F02",
            color: "#fff",
            border: "none",
            borderRadius: "10px",
            fontSize: "16px",
            cursor: "pointer"
          }}
        >
          Proceed to Document Upload
        </button>
      </form>
    </div>
  );
}
