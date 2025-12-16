import { useEffect, useState } from "react";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "./firebase";

export default function AdminDashboard() {
  const [players, setPlayers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPlayers();
  }, []);

  const fetchPlayers = async () => {
    try {
      const q = query(
        collection(db, "players"),
        orderBy("createdAt", "desc")
      );

      const snapshot = await getDocs(q);
      const allData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      // Only PLAYER registrations (exclude TOR)
      const playerOnly = allData.filter(
        (p) => p.name && p.playerType
      );

      setPlayers(playerOnly);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const filteredPlayers = players.filter((p) => {
    const v = search.toLowerCase();
    return (
      p.registrationNumber?.toLowerCase().includes(v) ||
      p.name?.toLowerCase().includes(v) ||
      p.mobile?.toLowerCase().includes(v) ||
      p.email?.toLowerCase().includes(v) ||
      p.teamName?.toLowerCase().includes(v)
    );
  });

  /* ---------------- CSV DOWNLOAD ---------------- */
  const downloadCSV = () => {
    const headers = [
      "Registration Number",
      "Name",
      "DOB",
      "Mobile",
      "Email",
      "Address",
      "Team Type",
      "Player Type",
      "Team Name",
      "Payment Status",
      "Created Date",
    ];

    const rows = filteredPlayers.map((p) => [
      p.registrationNumber || "",
      p.name || "",
      p.dob || "",
      p.mobile || "",
      p.email || "",
      p.address || "",
      p.teamType || "",
      p.playerType || "",
      p.teamName || "Any Team",
      p.paymentStatus || "Pending",
      p.createdAt?.toDate
        ? p.createdAt.toDate().toLocaleDateString()
        : "",
    ]);

    const csv =
      headers.join(",") +
      "\n" +
      rows.map((r) => r.map(escapeCSV).join(",")).join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "player-registrations.csv";
    link.click();
  };

  const escapeCSV = (v) => {
    if (typeof v === "string" && v.includes(",")) {
      return `"${v.replace(/"/g, '""')}"`;
    }
    return v;
  };

  if (loading) {
    return (
      <div style={{ padding: "40px", textAlign: "center" }}>
        Loading registrations…
      </div>
    );
  }

  const total = players.length;
  const pro = players.filter((p) => p.teamType === "Pro").length;
  const family = players.filter((p) => p.teamType === "Family").length;

  return (
    <div style={{ background: "#f4f6f9", minHeight: "100vh", padding: "30px" }}>
      <div
        style={{
          maxWidth: "1200px",
          margin: "auto",
          background: "#fff",
          padding: "30px",
          borderRadius: "14px",
          boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
        }}
      >
        {/* HEADER */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "10px",
            marginBottom: "20px",
          }}
        >
          <h2 style={{ margin: 0 }}>Player Registrations (Admin)</h2>

          <button
            onClick={downloadCSV}
            style={{
              padding: "10px 16px",
              backgroundColor: "#D05F02",
              color: "#fff",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              fontSize: "14px",
            }}
          >
            Download CSV
          </button>
        </div>

        {/* STATS */}
        <div
          style={{
            display: "flex",
            gap: "12px",
            marginBottom: "20px",
            flexWrap: "wrap",
          }}
        >
          <StatCard label="Total Players" value={total} />
          <StatCard label="Pro Players" value={pro} />
          <StatCard label="Family Players" value={family} />
        </div>

        {/* SEARCH */}
        <input
          placeholder="Search by name, mobile, email, reg no, team"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            width: "100%",
            padding: "12px",
            borderRadius: "8px",
            border: "1px solid #ccc",
            marginBottom: "16px",
            fontSize: "14px",
          }}
        />

        {/* TABLE */}
        {filteredPlayers.length === 0 ? (
          <p>No player registrations found.</p>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                fontSize: "14px",
              }}
            >
              <thead>
                <tr style={{ background: "#fff3e8" }}>
                  <Th>Reg No</Th>
                  <Th>Name</Th>
                  <Th>Mobile</Th>
                  <Th>Email</Th>
                  <Th>Team</Th>
                  <Th>Player Type</Th>
                  <Th>Payment</Th>
                  <Th>Created</Th>
                </tr>
              </thead>
              <tbody>
                {filteredPlayers.map((p, i) => (
                  <tr
                    key={p.id}
                    style={{
                      background: i % 2 === 0 ? "#fff" : "#fafafa",
                    }}
                  >
                    <Td>{p.registrationNumber}</Td>
                    <Td>{p.name}</Td>
                    <Td>{p.mobile}</Td>
                    <Td>{p.email}</Td>
                    <Td>{p.teamType}</Td>
                    <Td>{p.playerType}</Td>
                    <Td>{p.paymentStatus || "Pending"}</Td>
                    <Td>
                      {p.createdAt?.toDate
                        ? p.createdAt.toDate().toLocaleDateString()
                        : "-"}
                    </Td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

/* -------- SMALL UI HELPERS -------- */

function StatCard({ label, value }) {
  return (
    <div
      style={{
        flex: 1,
        minWidth: "160px",
        background: "#fff3e8",
        padding: "16px",
        borderRadius: "10px",
        textAlign: "center",
      }}
    >
      <div style={{ fontSize: "13px", color: "#666" }}>{label}</div>
      <div style={{ fontSize: "22px", fontWeight: 600 }}>{value}</div>
    </div>
  );
}

const Th = ({ children }) => (
  <th
    style={{
      padding: "10px",
      border: "1px solid #ddd",
      textAlign: "left",
    }}
  >
    {children}
  </th>
);

const Td = ({ children }) => (
  <td
    style={{
      padding: "8px",
      border: "1px solid #ddd",
    }}
  >
    {children}
  </td>
);
