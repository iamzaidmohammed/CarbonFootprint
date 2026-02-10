const getRecommendations = (scanData) => {
  const recommendations = [];
  const totalBytes = scanData.totalBytes;
  const totalMB = (totalBytes / (1024 * 1024)).toFixed(2);

  // Helper to calculate percentage
  const getPercentage = (part) => ((part / totalBytes) * 100).toFixed(0);

  // 1. Total Weight Rule (Priority: High)
  if (totalMB > 2) {
    recommendations.push({
      type: "Page Weight",
      priority: "High",
      message: `Critical: Your page is ${totalMB}MB. High-weight sites consume excessive energy across the network.`,
      action: "Reduce total page size to under 2MB by removing unused assets.",
    });
  }

  // 2. Image Ratio Rule (Priority: Medium/High)
  const imagePct = getPercentage(scanData.images);
  if (imagePct > 60) {
    recommendations.push({
      type: "Images",
      priority: imagePct > 80 ? "High" : "Medium",
      message: `Images make up ${imagePct}% of your total data. This is the largest contributor to your carbon footprint.`,
      action:
        "Use WebP/AVIF formats and implement 'lazy-loading' so images only load when scrolled into view.",
    });
  }

  // 3. JavaScript Optimization (Priority: Medium)
  const scriptPct = getPercentage(scanData.scripts);
  if (scriptPct > 30) {
    recommendations.push({
      type: "Scripts",
      priority: "Medium",
      message: `JavaScript accounts for ${scriptPct}% of the load. Heavy scripts increase CPU usage and battery drain.`,
      action:
        "Minify JS files and defer non-essential scripts until after the page renders.",
    });
  }

  // 4. CSS Cleanup (Priority: Low)
  if (scanData.css > 102400) {
    // Over 100KB
    recommendations.push({
      type: "Styles",
      priority: "Low",
      message: "Your CSS files are larger than 100KB.",
      action:
        "Use tools like PurgeCSS to remove unused styles that are sent to the user but never applied.",
    });
  }

  return recommendations;
};

module.exports = { getRecommendations };
