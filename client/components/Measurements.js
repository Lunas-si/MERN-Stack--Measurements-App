import React, { useState, useEffect } from "react";
import "../style.css";

function Measurements() {
    const [data, setData] = useState([]);
    const [average, setAverage] = useState(null);
    const [sortField, setSortField] = useState("unix_timestamp");
    const [sortOrder, setSortOrder] = useState("desc");

    async function fetchMeasurements() {
        try {
            console.log("Auto-refresh fetching at:", new Date().toLocaleTimeString());
            const response = await fetch("/api/measurements");
            const json = await response.json();
            setData(json);
            if (json.length > 0) {
                //const sum = json.reduce((acc, m) => acc + m.temperature, 0);
                const sum = json.reduce((acc, m) => acc + Number(m.temperature), 0);
                const avg = sum / json.length;
                setAverage(avg);
            } else {
                setAverage(null);
            }
        } catch (error) {
            console.error("Fetch error:", error);
        }
    }

    useEffect(() => {
        fetchMeasurements();
        const interval = setInterval(fetchMeasurements, 60000);
        return () => clearInterval(interval);
    }, []);

    const sortedData = [...data].sort((a, b) => {
        let aVal = a[sortField];
        let bVal = b[sortField];
        if (sortField === "temperature") {
            aVal = parseFloat(aVal);
            bVal = parseFloat(bVal);
        }
        if (aVal < bVal) return sortOrder === "asc" ? -1 : 1;
        if (aVal > bVal) return sortOrder === "asc" ? 1 : -1;
        return 0;
    });

    const handleSort = (field) => {
        if (field === sortField) {
            setSortOrder(sortOrder === "asc" ? "desc" : "asc");
        } else {
            setSortField(field);
            setSortOrder("asc");
        }
    };

    const getSortIndicator = (field) => {
        if (field === sortField) {
            return sortOrder === "asc" ? " ▲" : " ▼";
        }
        return "";
    };

    return (
        <div className="container">
            <section>
                <h1>Measurements Dashboard</h1>

                {average !== null && (
                    <div className="average-box">
                        <strong>Average Temperature (last 5):</strong> {average.toFixed(1)} °C
                    </div>
                )}

                <table className="measurements-table">
                    <thead>
                        <tr>
                            <th onClick={() => handleSort("unit_id")}>
                                Unit ID
                                <span className="sort-indicator">{getSortIndicator("unit_id")}</span>
                            </th>
                            <th onClick={() => handleSort("temperature")}>
                                Temperature (°C)
                                <span className="sort-indicator">{getSortIndicator("temperature")}</span>
                            </th>
                            <th onClick={() => handleSort("unix_timestamp")}>
                                Unix Timestamp
                                <span className="sort-indicator">{getSortIndicator("unix_timestamp")}</span>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {sortedData.length === 0 ? (
                            <tr>
                                <td colSpan="3">No data available</td>
                            </tr>
                        ) : (
                            sortedData.map((measurement) => (
                                <tr key={measurement._id}>
                                    <td>{measurement.unit_id ?? "N/A"}</td>
                                    <td>{measurement.temperature != null ? Number(measurement.temperature).toFixed(1) : "N/A"}</td>
                                    <td>{measurement.unix_timestamp ?? "N/A"}</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>

                <button className="refresh-btn" onClick={fetchMeasurements}>
                    ⟳ Refresh
                </button>
            </section>
        </div>
    );
}

export default Measurements;