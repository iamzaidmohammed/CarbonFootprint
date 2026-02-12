const axios = require("axios");

const checkGreenHosting = async (url) => {
  try {
    let hostname = new URL(url).hostname;
    if (hostname.startsWith("www.")) {
      hostname = hostname.replace("www.", "");
    }

    const response = await axios.get(
      `https://api.thegreenwebfoundation.org/greencheck/${hostname}`,
    );

    const isGreen = response.data.green || false;
    const provider = response.data.hostedbyname || "Unknown Provider";

    // Add a helpful note if the provider is unknown
    let note = "";
    if (provider === "Unknown Provider") {
      note =
        "This site may use a CDN or private data center that is not registered in the public Green Web database.";
    } else if (isGreen) {
      note =
        "This provider is verified to use renewable energy for its data centers.";
    } else {
      note =
        "This provider has no verified green energy claims in the global registry.";
    }

    return { isGreen, provider, note };
  } catch (error) {
    return {
      isGreen: false,
      provider: "Data unavailable",
      note: "The hosting check could not be completed due to network or API limitations.",
    };
  }
};

module.exports = { checkGreenHosting };
