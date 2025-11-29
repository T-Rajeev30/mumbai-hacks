import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import http from "../api/http.api.js";

export default function Dashboard() {
  const [hospitals, setHospitals] = useState([]);
  const [alerts, setAlerts] = useState(null);
  const [aggregation, setAggregation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [cityFilter, setCityFilter] = useState("");

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    Promise.all([
      http.get("/hospitals"),
      http.get("/alerts").catch((err) => {
        console.warn("Failed to load alerts", err);
        return null;
      }),
      http.get("/simulate/aggregate?by=city").catch((err) => {
        console.warn("Failed to load aggregation", err);
        return null;
      }),
    ])
      .then(([hospitalsRes, alertsRes, aggRes]) => {
        if (cancelled) return;
        setHospitals(hospitalsRes.data?.data || []);
        setAlerts(alertsRes?.data || null);
        setAggregation(aggRes?.data || null);
      })
      .catch((err) => {
        if (cancelled) return;
        setError(err?.message || "Failed to load data");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const cities = useMemo(() => {
    const set = new Set();
    hospitals.forEach((h) => {
      if (h.location?.city) set.add(h.location.city);
    });
    return Array.from(set).sort();
  }, [hospitals]);

  const filteredHospitals = useMemo(() => {
    return hospitals.filter((h) => {
      const cityMatch = cityFilter
        ? h.location?.city?.toLowerCase() === cityFilter.toLowerCase()
        : true;
      if (!cityMatch) return false;

      if (!search) return true;
      const needle = search.toLowerCase();
      const name = h.name?.toLowerCase() || "";
      const id = h.id?.toLowerCase() || "";
      const city = h.location?.city?.toLowerCase() || "";
      return (
        name.includes(needle) || id.includes(needle) || city.includes(needle)
      );
    });
  }, [hospitals, search, cityFilter]);

  const overallAlerts = alerts?.overall || null;

  return (
    <div>
      <div className="page-heading">
        <div>
          <div className="page-title">City Capacity Overview</div>
          <div className="page-subtitle">
            Live view of hospitals, alerts and load across Mumbai and beyond.
          </div>
        </div>
        <div className="page-actions">
          <input
            className="input"
            placeholder="Search by name, ID or city"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select
            className="input"
            value={cityFilter}
            onChange={(e) => setCityFilter(e.target.value)}
          >
            <option value="">All cities</option>
            {cities.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          <Link to="/simulator">
            <button type="button">Open Simulator</button>
          </Link>
        </div>
      </div>

      {loading && (
        <div className="card">
          <div className="card-body">Loading data from backend…</div>
        </div>
      )}

      {error && !loading && (
        <div className="card">
          <div className="card-header">
            <div className="card-title">Backend error</div>
          </div>
          <div className="card-body error-text">
            {error}
            <div className="muted" style={{ marginTop: "0.25rem" }}>
              Ensure the backend is running on <code>VITE_API_BASE</code> (or{" "}
              <code>http://localhost:5000/api</code>).
            </div>
          </div>
        </div>
      )}

      <div className="card-grid" style={{ marginTop: "0.75rem" }}>
        <div className="card">
          <div className="card-header">
            <div className="card-title">System alerts</div>
            <span className="card-badge">Global</span>
          </div>
          <div className="card-body stack-v">
            {overallAlerts ? (
              <>
                <div className="stack-h-wrap">
                  <span className="status-pill">
                    <span className="status-dot status-dot-critical" />
                    CRITICAL: {overallAlerts.CRITICAL ?? 0}
                  </span>
                  <span className="status-pill">
                    <span className="status-dot status-dot-warn" />
                    WARNING: {overallAlerts.WARNING ?? 0}
                  </span>
                  <span className="status-pill">
                    <span className="status-dot status-dot-ok" />
                    OK: {overallAlerts.OK ?? 0}
                  </span>
                </div>
                {alerts?.criticalCities?.length ? (
                  <div className="muted">
                    {alerts.criticalCities.length} city
                    {alerts.criticalCities.length > 1 ? " hotspots" : " hotspot"}
                    :{" "}
                    {alerts.criticalCities
                      .slice(0, 3)
                      .map((c) => c.city)
                      .join(", ")}
                    {alerts.criticalCities.length > 3 ? "…" : ""}
                  </div>
                ) : (
                  <div className="muted">
                    No cities in critical status right now.
                  </div>
                )}
              </>
            ) : (
              <div className="muted">
                Alerts service unavailable; simulation still works without it.
              </div>
            )}
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <div className="card-title">City load snapshot</div>
            <span className="card-badge">Simulated</span>
          </div>
          <div className="card-body">
            {aggregation?.cities?.length ? (
              <div className="scroll-x">
                <table className="table">
                  <thead>
                    <tr>
                      <th>City</th>
                      <th>Hospitals</th>
                      <th>Occupancy</th>
                      <th>Alerts</th>
                    </tr>
                  </thead>
                  <tbody>
                    {aggregation.cities.slice(0, 5).map((city) => (
                      <tr key={city.city}>
                        <td>{city.city}</td>
                        <td>{city.count}</td>
                        <td>
                          {Math.round(city.summary.occupancy * 100)}
                          <span className="muted">%</span>
                        </td>
                        <td>
                          <span className="chip">
                            <span className="status-dot status-dot-critical" />
                            {city.summary.alerts.CRITICAL}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="muted">
                Aggregation not available yet. Run a simulation from the
                Simulator page to populate data.
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="card" style={{ marginTop: "1rem" }}>
        <div className="card-header">
          <div className="card-title">
            Hospitals ({filteredHospitals.length})
          </div>
        </div>
        <div className="card-body">
          {!loading && !filteredHospitals.length && (
            <div className="muted">
              No hospitals match this filter. Try clearing search / city.
            </div>
          )}
          {filteredHospitals.length > 0 && (
            <div className="scroll-x">
              <table className="table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>ID</th>
                    <th>City</th>
                    <th>State</th>
                    <th>Beds</th>
                    <th>Ventilators</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredHospitals.map((h) => (
                    <tr key={h._id}>
                      <td>
                        <Link
                          to={`/hospital/${h._id}`}
                          className="table-row-link"
                        >
                          {h.name || "Unnamed hospital"}
                        </Link>
                      </td>
                      <td className="mono">{h.id}</td>
                      <td>{h.location?.city || "-"}</td>
                      <td>{h.location?.state || "-"}</td>
                      <td>{h.resources?.beds ?? "-"}</td>
                      <td>{h.resources?.ventilators ?? "-"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
