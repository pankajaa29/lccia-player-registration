import { useEffect, useState } from "react";
import { db } from "./firebase";
import { collection, getDocs, orderBy, query } from "firebase/firestore";

/**
 * CHANGE THIS PASSWORD BEFORE SHARING
 */
const ADMIN_PASSWORD = "LCCIA@2026";

export default function AdminDashboard() {
  const [authorized, setAuthorized] = useState(false);

  const [players, setPlayers] = useState([]);
  const [filteredPlayers, setFilteredPlayers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [teamType, setTeamType] = useState("");
  const [playerType, setPlayerType] = useState("");

  // 🔐 ADMIN PASSWORD CHECK
  useEffect(() => {
    const pwd = prompt("Enter Admin Password");
    if (pwd === ADMIN_PASSWORD) {
      setAuthorized(true);
    } else {
      alert("Unauthorized access");
      window.location.href = "/#/";
    }
  }, []);

  // 🔄 FETCH DATA
  useEffect(() => {
    if (!authorized) return;

    const fetchPlayers = async () => {
      try {
        const q = query(
          collection(db, "players"),
          orderBy("createdAt", "desc")
        );
        const snapshot = await getDocs(q);

        const data = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        setPlayers(data);
        setFilteredPlayers(data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        alert("Failed to load registrations");
        setLoading(false);
      }
    };

    fetchPlayers();
  }, [authorized]);

  // 🔍 SEARCH & FILTER
  useEffect(() => {
    let data = [...players];

    if (search) {
      const s = search.toLowerCase();
      data = data.filter(p =>
        (p.name || "").toLowerCase().includes(s) ||
        (p.mobile || "").toLowerCase().includes(s) ||
        (p.email || "").toLowerCase().includes(s) ||
        (p.teamName || "").toLowerCase().includes(s) ||
        (p.registrationNumber || "").toString().includes(s)
      );
    }

    if (teamType) {
      data = data.filter(p => p.teamType === teamType);
    }

    if (playerType) {
      data = data.filter(p => p.playerType === playerType);
    }

    setFilteredPlayers(data);
  }, [search, teamType, playerType, players]);

  const resetFilters = () => {
    setSearch("");
    setTeamType("");
    setPlayerType("");
    setFilteredPlayers(players);
  };

  const downloadCSV = () => {
    if (!filteredPlayers.length) return;

    const headers = Object.keys(filteredPlayers[0]).join(",");
    const rows = filteredPlayers.map(p =>
      Object.values(p)
        .map(v => `"${v ?? ""}"`)
        .join(",")
    );

    const csv = [headers, ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "lccia_player_registrations.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!authorized) {
    return null;
  }

  if (loading) {
    return (
      <p style={{ textAlign: "center", marginTop: "50px" }}>
        Loading registrations…
      </p>
    );
  }

  return (
    <div style={{ background: "#f4f6f9", minHeight: "100vh", padding: "30px" }}>
      <div
        style={{
          maxWidth: "1300px",
          margin: "auto",
          background: "#ffffff",
          padding: "25px",
          borderRadius: "12px",
          boxShadow: "0 8px 20px rgba(0,0,0,0.08)"
        }}
      >
        {/* HEADER */}
        <div style={{ marginBottom: "20px" }}>
          <h2 style={{ margin: 0 }}>LCCIA Sports League – Admin</h2>
          <p style={{ margin: "5px 0", color: "#666" }}>
            Player Registrations ({filteredPlayers.length})
          </p>
        </div>

        {/* FILTERS */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "12px",
            marginBottom: "15px"
          }}
        >
          <input
            placeholder="Search name / mobile / email / team / reg no"
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
              padding: "10px",
              borderRadius: "8px",
              border: "1px solid #ccc",
              minWidth: "260px"
            }}
          />

          <select
            value={teamType}
            onChange={e => setTeamType(e.target.value)}
            style={{
              padding: "10px",
              borderRadius: "8px",
              border: "1px solid #ccc"
            }}
          >
            <option value="">All Team Types</option>
            <option value="Pro">Pro</option>
            <option value="Family">Family</option>
          </select>

          <select
            value={playerType}
            onChange={e => setPlayerType(e.target.value)}
            style={{
              padding: "10px",
              borderRadius: "8px",
              border: "1px solid #ccc"
            }}
          >
            <option value="">All Player Types</option>
            <option>Batsman</option>
            <option>Bowler</option>
            <option>Wicket Keeper</option>
            <option>All Rounder</option>
          </select>

          <button
            onClick={resetFilters}
            style={{
              padding: "10px 14px",
              background: "#999",
              color: "#fff",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer"
            }}
          >
            Reset
          </button>

          <button
            onClick={downloadCSV}
            style={{
              padding: "10px 16px",
              background: "#D05F02",
              color: "#fff",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer"
            }}
          >
            Download CSV
          </button>
        </div>

        {/* EMPTY STATE */}
        {filteredPlayers.length === 0 && (
          <p
            style={{
              padding: "30px",
              textAlign: "center",
              color: "#777",
              fontStyle: "italic"
            }}
          >
            No registrations found.
          </p>
        )}

        {/* TABLE */}
        {filteredPlayers.length > 0 && (
          <div style={{ overflowX: "auto" }}>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                fontSize: "14px"
              }}
            >
              <thead>
                <tr style={{ background: "#eef3f8" }}>
                  {Object.keys(filteredPlayers[0]).map(key => (
                    <th
                      key={key}
                      style={{
                        padding: "10px",
                        borderBottom: "1px solid #ddd",
                        textAlign: "left",
                        whiteSpace: "nowrap"
                      }}
                    >
                      {key}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {filteredPlayers.map((p, idx) => (
                  <tr
                    key={p.id}
                    style={{
                      background: idx % 2 === 0 ? "#fff" : "#fafafa"
                    }}
                  >
                    {Object.values(p).map((val, i) => (
                      <td
                        key={i}
                        style={{
                          padding: "8px 10px",
                          borderBottom: "1px solid #eee",
                          whiteSpace: "nowrap"
                        }}
                      >
                        {String(val)}
                      </td>
                    ))}
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
