// Sustainable Web Design (SWD) Model Constants
const KWH_PER_GB = 0.81;
const GLOBAL_CARBON_INTENSITY = 442; // grams of CO2 per kWh

const calculateEmissions = (bytes, isGreenHost = false) => {
  const gigabytes = bytes / (1024 * 1024 * 1024);
  const energyKwh = gigabytes * KWH_PER_GB;

  // If hosted on green energy, we reduce the carbon intensity
  const intensity = isGreenHost ? 50 : GLOBAL_CARBON_INTENSITY;

  const co2Grams = energyKwh * intensity;

  return {
    co2Grams: co2Grams.toFixed(4),
    energyKwh: energyKwh.toFixed(6),
    grade: assignGrade(co2Grams),
  };
};

const assignGrade = (grams) => {
  if (grams < 0.2) return "A";
  if (grams < 0.5) return "B";
  if (grams < 1.0) return "C";
  if (grams < 2.0) return "D";
  return "F";
};

module.exports = { calculateEmissions };
