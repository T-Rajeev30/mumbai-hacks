import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import http from "../api/http.api.js";

export default function HospitalDetails() {
  const { id } = useParams();
  const [h, setH] = useState(null);
  const [err, setErr] = useState(null);

  useEffect(() => {
    if (!id) return;
    http
      .get(`/hospitals/${id}`)
      .then((r) => setH(r.data.data))
      .catch((e) => setErr(e.message || "Failed to fetch"));
  }, [id]);

  if (err) return <div style={{ padding: 20 }}>Error: {err}</div>;
  if (!h) return <div style={{ padding: 20 }}>Loading...</div>;

  return (
    <div style={{ padding: 20 }}>
      <h1>{h.name}</h1>
      <p>Beds: {h.beds}</p>
      <pre>{JSON.stringify(h, null, 2)}</pre>
    </div>
  );
}
