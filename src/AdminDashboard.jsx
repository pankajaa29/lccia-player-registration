import { useEffect, useState } from "react";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "./firebase";

/* 🔐 ADMIN PASSWORD */
const ADMIN_PASSWORD = "lccia@admin2026";

export default function AdminDashboard() {
  const [authorized, setAuthorized] = useState(false);
  const [password, setPassword] = useState("");

  const [activeTab, setActiveTab] = useState("PLAYER");
  const [players, setPlayers] = useState([]);
  const [tors, setTors] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  /* ---------- LOGIN ---------- */
  const handleLogin = (e) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setAuthorized(true);
    } else {
      alert("Incorrect password");
    }
  };

  useEffect(() => {
    if (authorized) {
      fetchData();
    }
  }, [authorized]);

  /* ---------- FETCH DATA ---------- */
  const fetchData = async () => {
    setLoading(true);
    try {
      const q = query(
        collection(db, "players"),
        orderBy("createdAt", "desc")
      );

      const snapshot = await getDocs(q);
      const all = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      // Player registrations (normal form)
      const playerOnly = all.filter(
        (d) => d.name && d.playerType
      );

      // TOR registrations
      const torOnly = all.filter(
        (d) => d.formType === "TOR"
      );

      setPlayers(playerOnly);
      setTors(torOnly);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  /* ---------- FILTER ---------- */
  const activeData = activeTab === "PLAYER" ? players : tors;

  const filteredData = activeData.filter((d) => {
    const v = search.toLowerCase();
    return (
      d.registrationNumber?.toLowerCase().includes(v) ||
      d.name?.toLowerCase().includes(v) ||
      d.ownerName?.toLowerCase().includes(v) ||
      d.mobile?.toLowerCase().includes(v) ||
      d.email?.toLowerCase().includes(v) ||
      d.teamName?.toLowerCase().includes(v)
    );
  });

  /* ---------- CSV ---------- */
  const downloadCSV = () => {
    const headers =
      activeTab === "PLAYER"
        ? [
            "Registration Number",
            "Name",
            "Mobile",
            "Email",
            "Team Type",
            "Player Type",
            "Team Name",
            "Payment Status",
            "Created At",
          ]
        : [
            "TOR Registration Number",
            "Owner Name",
            "Mobile",
            "Email",
            "Category",
            "Membership",
            "Team Name",
            "Created At",
          ];

    const rows = filteredData.map((d) =>
      activeTab === "PLAYER"
        ? [
            d.registrationNumber,
            d.name,
            d.mobile,
            d.email,
            d.teamType,
            d.playerType,
            d.teamName,
            d.paymentStatus || "Pending",
            d.createdAt?.toDate
              ? d.createdAt.toDate().toLocaleString()
              : "",
          ]
        : [
            d.registrationNumber,
            d.ownerName,
            d.mobile,
            d.email,
            d.category,
            d.hasMembership,
            d.teamName,
            d.createdAt?.toDate
              ? d.createdAt.toDate().toLocaleString()
              : "",
          ]
    );

    const csv =
      headers.join(",") +
      "\n" +
      rows.map((r) => r.map(escapeCSV).join(",")).join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download =
      activeTab === "PLAYER"
        ? "player-registrations.csv"
        : "tor-registrations.csv";
    link.click();
  };

  const escapeCSV = (v) =>
    typeof v === "string" && v.includes(",")
      ? `"${v.replace(/"/g, '""')}"`
      : v;

  /* ---------- LOGIN SCREEN ---------- */
  if (!authorized) {
    return (
      <Centered>
        <form onSubmit={handleLogin} style={loginCard}>
          <h3>Admin Login</h3>
          <input
            type="password"
            placeholder="Admin password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={input}
          />
          <button style={btn}>Login</button>
        </form>
      </Centered>
    );
  }

  if (loading) {
    return <Centered>Loading…</Centered>;
  }

  /* ---------- DASHBOARD ---------- */
  return (
    <div style={page}>
      <div style={card}>
        {/* HEADER */}
        <div style={header}>
          <h2 style={{ margin: 0 }}>Admin Dashboard</h2>
          <button onClick={downloadCSV} style={btn}>
            Download CSV
          </button>
        </div>

        {/* TABS */}
        <div style={tabs}>
          <Tab
            active={activeTab === "PLAYER"}
            onClick={() => setActiveTab("PLAYER")}
          >
            Player Registrations
          </Tab>
          <Tab
            active={activeTab === "TOR"}
            onClick={() => setActiveTab("TOR")}
          >
            Team Owner Registrations
          </Tab>
        </div>

        {/* SEARCH */}
        <input
          placeholder="Search by name, mobile, email, team, reg no…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ ...input, marginBottom: "16px" }}
        />

        {/* TABLE */}
        <div style={{ overflowX: "auto" }}>
          <table style={table}>
            <thead>
              <tr style={{ background: "#fff3e8" }}>
                {activeTab === "PLAYER" ? (
                  <>
                    <Th>Reg No</Th>
                    <Th>Name</Th>
                    <Th>Mobile</Th>
                    <Th>Email</Th>
                    <Th>Team Type</Th>
                    <Th>Player Type</Th>
                    <Th>Team Name</Th>
                    <Th>Payment</Th>
                    <Th>Created</Th>
                  </>
                ) : (
                  <>
                    <Th>TOR Reg No</Th>
                    <Th>Owner Name</Th>
                    <Th>Mobile</Th>
                    <Th>Email</Th>
                    <Th>Category</Th>
                    <Th>Membership</Th>
                    <Th>Team Name</Th>
                    <Th>Created</Th>
                  </>
                )}
              </tr>
            </thead>
            <tbody>
              {filteredData.map((d, i) => (
                <tr key={d.id} style={{ background: i % 2 ? "#fafafa" : "#fff" }}>
                  {activeTab === "PLAYER" ? (
                    <>
                      <Td>{d.registrationNumber}</Td>
                      <Td>{d.name}</Td>
                      <Td>{d.mobile}</Td>
                      <Td>{d.email}</Td>
                      <Td>{d.teamType}</Td>
                      <Td>{d.playerType}</Td>
                      <Td>{d.teamName || "-"}</Td>
                      <Td>{d.paymentStatus || "Pending"}</Td>
                      <Td>
                        {d.createdAt?.toDate
                          ? d.createdAt.toDate().toLocaleString()
                          : "-"}
                      </Td>
                    </>
                  ) : (
                    <>
                      <Td>{d.registrationNumber}</Td>
                      <Td>{d.ownerName}</Td>
                      <Td>{d.mobile}</Td>
                      <Td>{d.email}</Td>
                      <Td>{d.category}</Td>
                      <Td>{d.hasMembership}</Td>
                      <Td>{d.teamName || "-"}</Td>
                      <Td>
                        {d.createdAt?.toDate
                          ? d.createdAt.toDate().toLocaleString()
                          : "-"}
                      </Td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* ---------- UI HELPERS ---------- */

const page = {
  background: "#f4f6f9",
  minHeight: "100vh",
  padding: "30px",
};

const card = {
  maxWidth: "1200px",
  margin: "auto",
  background: "#fff",
  padding: "30px",
  borderRadius: "14px",
  boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
};

const header = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "16px",
};

const tabs = {
  display: "flex",
  gap: "8px",
  marginBottom: "16px",
};

const Tab = ({ active, children, onClick }) => (
  <button
    onClick={onClick}
    style={{
      padding: "10px 16px",
      borderRadius: "8px",
      border: "none",
      cursor: "pointer",
      background: active ? "#D05F02" : "#eee",
      color: active ? "#fff" : "#333",
    }}
  >
    {children}
  </button>
);

const Th = ({ children }) => (
  <th style={{ padding: "10px", border: "1px solid #ddd" }}>{children}</th>
);

const Td = ({ children }) => (
  <td style={{ padding: "8px", border: "1px solid #ddd" }}>{children}</td>
);

const table = {
  width: "100%",
  borderCollapse: "collapse",
  fontSize: "14px",
};

const input = {
  width: "100%",
  padding: "12px",
  borderRadius: "8px",
  border: "1px solid #ccc",
};

const btn = {
  backgroundColor: "#D05F02",
  color: "#fff",
  border: "none",
  borderRadius: "8px",
  padding: "10px 16px",
  cursor: "pointer",
};

const loginCard = {
  background: "#fff",
  padding: "30px",
  borderRadius: "14px",
  boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
  width: "320px",
};

const Centered = ({ children }) => (
  <div
    style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "#f4f6f9",
    }}
  >
    {children}
  </div>
);
