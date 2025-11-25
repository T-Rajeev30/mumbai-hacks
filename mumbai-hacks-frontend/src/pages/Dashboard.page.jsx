import { useEffect, useState } from "react";
import http from "../api/http.api.js";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const [hospitals, setHospitals] = useState([]);
  const [err, setErr] = useState(null);

  useEffect(() => {
    http
      .get("/hospitals")
      .then((r) => setHospitals(r.data.data || []))
      .catch((e) => setErr(e.message || "Failed"));
  }, []);

  if (err) return <div style={{ padding: 20 }}>Error: {err}</div>;

  return (
    <div style={{ padding: 20 }}>
      <h1>Dashboard</h1>
      <Link to="/simulator">Go to Simulator</Link>
      <ul>
        {hospitals.map((h) => (
          <li key={h._id}>
            <Link to={`/hospital/${h._id}`}>
              {h.name} — beds: {h.beds}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
