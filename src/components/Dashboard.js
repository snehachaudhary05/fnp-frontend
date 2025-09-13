import React, { useEffect, useState, useRef } from "react";
import Chart from "chart.js/auto";

const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:5000";

const Dashboard = ({ token }) => {
  const [metrics, setMetrics] = useState(null);
  const [metricsError, setMetricsError] = useState("");
  const [loadingMetrics, setLoadingMetrics] = useState(true);

  const [dateRange, setDateRange] = useState({ start: "", end: "" });
  const [trends, setTrends] = useState([]);
  const [trendsError, setTrendsError] = useState("");
  const [loadingTrends, setLoadingTrends] = useState(false);

  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  // Fetch metrics summary
  useEffect(() => {
    if (!token) return;
    setLoadingMetrics(true);
    setMetricsError("");

    fetch(`${API_BASE}/metrics?tenantId=sneha-xeno-store`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(async (res) => {
        if (!res.ok) throw new Error("Failed to fetch metrics");
        return res.json();
      })
      .then((data) => setMetrics(data))
      .catch((err) => setMetricsError(err.message))
      .finally(() => setLoadingMetrics(false));
  }, [token]);

  // Fetch trends
  useEffect(() => {
    if (!token || !dateRange.start || !dateRange.end) return;
    setTrendsError("");
    setLoadingTrends(true);

    fetch(
      `${API_BASE}/metrics/trends?tenantId=sneha-xeno-store&startDate=${dateRange.start}&endDate=${dateRange.end}`,
      { headers: { Authorization: `Bearer ${token}` } }
    )
      .then(async (res) => {
        if (!res.ok) throw new Error("Failed to fetch trends");
        return res.json();
      })
      .then((data) => setTrends(Array.isArray(data) ? data : []))
      .catch((err) => setTrendsError(err.message))
      .finally(() => setLoadingTrends(false));
  }, [dateRange, token]);

  // Render chart
  useEffect(() => {
    if (!chartRef.current) return;
    if (chartInstance.current) chartInstance.current.destroy();
    if (trends.length === 0) return;

    chartInstance.current = new Chart(chartRef.current, {
      type: "line",
      data: {
        labels: trends.map((t) => t.date),
        datasets: [
          {
            label: "Orders",
            data: trends.map((t) => t.orders),
            borderColor: "#3897f0",
            backgroundColor: "rgba(56, 151, 240, 0.1)",
            fill: true,
          },
          {
            label: "Revenue",
            data: trends.map((t) => t.revenue),
            borderColor: "#27ae60",
            backgroundColor: "rgba(39, 174, 96, 0.1)",
            fill: true,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: { legend: { position: "top" } },
        scales: { y: { beginAtZero: true } },
      },
    });
  }, [trends]);

  if (loadingMetrics) return <div style={styles.loading}>Loading metrics...</div>;
  if (metricsError) return <div style={styles.error}>{metricsError}</div>;
  if (!metrics) return <div style={styles.error}>No metrics found</div>;

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h2 style={styles.heading}>📊 Shopify Insights Dashboard</h2>

        {/* Summary */}
        <section style={styles.section}>
          <h3 style={styles.subheading}>Summary</h3>
          <p><strong>Total Customers:</strong> {metrics.totalCustomers || 0}</p>
          <p><strong>Total Orders:</strong> {metrics.totalOrders || 0}</p>
          <p>
            <strong>Total Revenue:</strong> $
            {(metrics.totalRevenue || 0).toFixed(2)}
          </p>
        </section>

        {/* Top Customers */}
        <section style={styles.section}>
          <h3 style={styles.subheading}>Top 5 Customers by Spend</h3>
          <ul style={styles.list}>
            {metrics.topCustomers && metrics.topCustomers.length > 0 ? (
              metrics.topCustomers.map((c, i) => (
                <li key={i} style={styles.listItem}>
                  <span>{c.name || "Unknown"} ({c.email || "N/A"})</span>
                  <span style={styles.amount}>${(c.totalSpent || 0).toFixed(2)}</span>
                </li>
              ))
            ) : (
              <li style={styles.listItem}>No customers found</li>
            )}
          </ul>
        </section>

        {/* Trends */}
        <section style={styles.section}>
          <h3 style={styles.subheading}>Orders & Revenue Trends</h3>
          <div style={styles.dateRange}>
            <input
              type="date"
              value={dateRange.start}
              onChange={(e) =>
                setDateRange({ ...dateRange, start: e.target.value })
              }
              style={styles.input}
            />
            <input
              type="date"
              value={dateRange.end}
              onChange={(e) =>
                setDateRange({ ...dateRange, end: e.target.value })
              }
              style={styles.input}
            />
          </div>
          {trendsError && <div style={styles.error}>{trendsError}</div>}
          {loadingTrends ? (
            <p style={styles.loading}>Loading trends...</p>
          ) : trends.length > 0 ? (
            <canvas ref={chartRef} width="600" height="300"></canvas>
          ) : (
            <p style={styles.note}>Select a date range to view trends</p>
          )}
        </section>
      </div>
    </div>
  );
};

const styles = {
  page: {
    display: "flex",
    justifyContent: "center",
    marginTop: "40px",
    fontFamily: "Arial, sans-serif",
  },
  card: {
    width: "100%",
    maxWidth: "700px",
    padding: "20px",
    border: "1px solid #ddd",
    borderRadius: "12px",
    backgroundColor: "#fff",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
  },
  heading: {
    textAlign: "center",
    marginBottom: "20px",
    color: "#262626",
  },
  subheading: {
    marginBottom: "10px",
    color: "#3897f0",
  },
  section: {
    marginBottom: "20px",
  },
  list: {
    listStyle: "none",
    padding: 0,
  },
  listItem: {
    display: "flex",
    justifyContent: "space-between",
    padding: "8px 0",
    borderBottom: "1px solid #eee",
    fontSize: "14px",
  },
  amount: {
    fontWeight: "bold",
    color: "#27ae60",
  },
  dateRange: {
    display: "flex",
    gap: "10px",
    marginBottom: "10px",
  },
  input: {
    padding: "8px",
    border: "1px solid #ccc",
    borderRadius: "6px",
    fontSize: "14px",
    flex: 1,
  },
  loading: {
    textAlign: "center",
    color: "#888",
  },
  error: {
    color: "red",
    textAlign: "center",
  },
  note: {
    textAlign: "center",
    color: "#888",
  },
};

export default Dashboard;
