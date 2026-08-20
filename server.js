const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 5000;

/* =============================
   SENSOR STATE (PERSISTENT)
   ============================= */
let temperature = 27.5;
let humidity = 61.0;

/* =============================
   FLUCTUATION HELPERS
   ============================= */
const fluctuate = (value, min, max, step = 0.2) => {
  const delta = (Math.random() * step * 2) - step;
  let next = value + delta;

  if (next < min) next = min;
  if (next > max) next = max;

  return Number(next.toFixed(1));
};

/* =============================
   MOCK SENSOR ENDPOINT
   ============================= */
app.get("/api/data", (req, res) => {
  temperature = fluctuate(temperature, 24, 35, 0.15);
  humidity = fluctuate(humidity, 45, 85, 0.3);

  const mockData = {
    temperature,
    humidity,
    soil: temperature > 30 ? "DRY" : "WET",
    timestamp: Date.now()
  };

  res.json(mockData);
});

/* =============================
   SERVE REACT BUILD
   ============================= */
app.use(express.static(path.join(__dirname, "build")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

/* =============================
   START SERVER
   ============================= */
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
