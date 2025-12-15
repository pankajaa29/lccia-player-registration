import React, { useState } from "react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";

const containerStyle = {
  maxWidth: "800px",
  margin: "40px auto",
  padding: "24px",
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Inter, Helvetica, Arial, sans-serif",
  color: "#333",
};

const inputStyle = {
  width: "100%",
  padding: "12px 14px",
  marginBottom: "18px",
  borderRadius: "12px",
  border: "1px solid #ccc",
  fontSize: "15px",
  backgroundColor: "#fafafa",
  outline: "none",
};

const labelStyle = {
  fontWeight: "500",
  marginBottom: "6px",
  display: "block",
};

function TORRegistration() {
  const [loading, setLoading] = useState(false);
  const [successData, setSuccessData] = useState(null);

  const [formData, setFormData] = useState({
    ownerName: "",
    hasMembership: "",
    category: "",
    mobile: "",
    email: "",
    teamName: "",
    declaration: false,
  });

  const generateRegistrationNumber = () =>
    `TOR2026${Math.floor(1000 + Math.random() * 9000)}`;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.declaration) {
      alert("Please accept the declaration to proceed");
      return;
    }

    setLoading(true);
    const registrationNumber = generateRegistrationNumber();

    try {
      await addDoc(collection(db, "players"), {
        formType: "TOR",
        registrationNumber,
        ownerName: formData.ownerName,
        hasMembership: formData.hasMembership,
        category: formData.category,
        mobile: formData.mobile,
        email: formData.email,
        teamName: formData.teamName,
        createdAt: serverTimestamp(),
      });

      setSuccessData({
        registrationNumber,
        ownerName: formData.ownerName,
        mobile: formData.mobile,
      });

      setTimeout(() => {
        const googleFormUrl =
          "https://docs.google.com/forms/d/e/1FAIpQLScSoTf9_184aTnQb4hGzwrXlANy5haJq_pT9nh2i_aJPewJ3w/viewform" +
          "?usp=pp_url" +
          `&entry.1849851053=${encodeURIComponent(registrationNumber)}` +
          `&entry.1342872555=${encodeURIComponent(formData.ownerName)}` +
          `&entry.1336839005=${encodeURIComponent(formData.mobile)}`;

        window.location.href = googleFormUrl;
      }, 3000);
    } catch (err) {
      console.error(err);
      alert("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  /* ---------- FORM UI ---------- */
  return (
    <div style={containerStyle}>
      <div style={{ textAlign: "center", marginBottom: "30px" }}>
        <img
          src="/lccia-logo.png"
          alt="LCCIA Logo"
          style={{ maxWidth: "220px", width: "100%" }}
        />
      </div>

      <h1 style={{ textAlign: "center", fontWeight: 600 }}>
        TEAM OWNER REGISTRATION FORM
      </h1>

      <p>
        <strong>Note:</strong> Form to be filled by Team owner to register team
        for LSL Season - 4.
      </p>

      <p>
        <strong>Please Note:</strong> Membership Discount only for active
        membership till 31st Dec 2025.
      </p>

      <hr />

      <h3>Bank Account Details</h3>
      <p>
        <strong>LCCIA HDFC Bank Account</strong><br />
        Name :- Leva Chamber Of Commerce I And A<br />
        A/C No :- 50200072786737<br />
        IFSC :- HDFC0002524<br />
        Branch :- Pimple Saudagar, Pune
      </p>

      <p>
        <strong>Last Date to Pay and Register:</strong> 18th Dec 2025.
      </p>

      <p>
        <strong>For any queries:</strong><br /><br />
        <strong>PCMC Chapter :-</strong><br />
        Bhushan Gajare – 9371458989<br />
        Lokesh Patil – 8452098089<br /><br />
        <strong>Pune Chapter :-</strong><br />
        Narendra Mahajan – 9822197642<br />
        Govinda Mahajan – 9075039501
      </p>

      <hr />

      <form onSubmit={handleSubmit}>
        <label style={labelStyle}>Name of Owner *</label>
        <input
          type="text"
          name="ownerName"
          value={formData.ownerName}
          onChange={handleChange}
          required
          style={inputStyle}
        />

        <label style={labelStyle}>
          Do you have LCCIA active membership till 31 Dec 2025? *
        </label>

        <label>
          <input
            type="radio"
            name="hasMembership"
            value="Yes"
            onChange={handleChange}
            required
          />{" "}
          Yes
        </label>
        <br />
        <label>
          <input
            type="radio"
            name="hasMembership"
            value="No"
            onChange={handleChange}
          />{" "}
          No
        </label>

        <br /><br />

        <label style={labelStyle}>Category You wish to play *</label>
        <label>
          <input
            type="radio"
            name="category"
            value="Pro"
            onChange={handleChange}
            required
          />{" "}
          Pro
        </label>
        <br />
        <label>
          <input
            type="radio"
            name="category"
            value="Family"
            onChange={handleChange}
          />{" "}
          Family
        </label>

        <br /><br />

        <label style={labelStyle}>Mobile No. (WhatsApp) *</label>
        <input
          type="tel"
          name="mobile"
          value={formData.mobile}
          onChange={handleChange}
          required
          style={inputStyle}
        />

        <label style={labelStyle}>Email *</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
          style={inputStyle}
        />

        <label style={labelStyle}>Team Name</label>
        <input
          type="text"
          name="teamName"
          value={formData.teamName}
          onChange={handleChange}
          style={inputStyle}
        />

        {/* ✅ FEES DETAILS & DISCOUNT INFO (RESTORED) */}
        <h3>Fees Details & Discount Info</h3>
        <p>
          <strong>
            Team Ownership Fees: INR 15,000/- for Pro Team & INR 10,000/- for
            Family Team
          </strong>
          <br />
          (If participated in previous seasons – Pro: INR 11,000 / Family:
          INR 7,000)
        </p>

        <p style={{ fontWeight: 600, marginTop: "12px" }}>
          Following Discounts are applicable for Active LCCIA Membership on top
          of Above
        </p>

        <ul>
          <li>Primary – 10%</li>
          <li>Associate – 20%</li>
          <li>Classic – 30%</li>
          <li>Life Membership – 50%</li>
        </ul>

        <label style={{ display: "block", marginTop: "16px" }}>
          <input
            type="checkbox"
            name="declaration"
            checked={formData.declaration}
            onChange={handleChange}
          />{" "}
          <strong>
            DECLARATION*: We hereby agree that we have read and understood all
            Rules & Regulations.
          </strong>
        </label>

        <br />

        <button
          type="submit"
          disabled={loading}
          style={{
            width: "100%",
            padding: "14px",
            backgroundColor: "#D05F02",
            color: "#fff",
            border: "none",
            borderRadius: "10px",
            fontSize: "16px",
            cursor: "pointer",
            opacity: loading ? 0.7 : 1,
          }}
        >
          {loading ? "Submitting..." : "Proceed to Payment & Upload Screenshot"}
        </button>
        {successData && (
  <div
    style={{
      marginTop: "20px",
      padding: "16px",
      background: "#e8f5e9",
      borderRadius: "10px",
      textAlign: "center",
    }}
  >
    <h3 style={{ margin: 0 }}>Registration Successful</h3>
    <p>Your TOR Registration Number</p>
    <strong>{successData.registrationNumber}</strong>
    <p style={{ marginTop: "10px" }}>
      Redirecting to payment upload form…
    </p>
  </div>
)}
      </form>
    </div>
  );
}

export default TORRegistration;
