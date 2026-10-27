const dns = require("dns").promises;
const net = require("net");

// Blocks private/internal addresses so the scanner can't be pointed at the server's own network.
const isPrivateIp = (ip) => {
  if (net.isIPv6(ip)) {
    const v = ip.toLowerCase();
    if (v.startsWith("::ffff:")) return isPrivateIp(v.slice(7));
    return v === "::1" || v === "::" || v.startsWith("fc") || v.startsWith("fd") || v.startsWith("fe80");
  }
  const [a, b] = ip.split(".").map(Number);
  return (
    a === 0 || a === 10 || a === 127 ||
    (a === 169 && b === 254) ||           // link-local + cloud metadata
    (a === 172 && b >= 16 && b <= 31) ||
    (a === 192 && b === 168) ||
    (a === 100 && b >= 64 && b <= 127)    // carrier-grade NAT
  );
};

const validateUrl = async (input) => {
  let parsed;
  try {
    parsed = new URL(input);
  } catch {
    throw new Error("Invalid URL. Include http:// or https://");
  }
  if (!["http:", "https:"].includes(parsed.protocol)) {
    throw new Error("Only http and https URLs are allowed.");
  }
  const host = parsed.hostname.replace(/^\[|\]$/g, "");
  const addresses = net.isIP(host)
    ? [{ address: host }]
    : await dns.lookup(host, { all: true }).catch(() => {
        throw new Error("Could not resolve that website's address.");
      });
  if (addresses.some((a) => isPrivateIp(a.address))) {
    throw new Error("That address is not allowed.");
  }
  return parsed.href;
};

module.exports = { validateUrl };
