# Official Puppeteer image: already contains Chrome and all its system libraries
FROM ghcr.io/puppeteer/puppeteer:24

# Let Puppeteer use its own default Chrome (npm ci downloads the matching version
# into the user's cache), so we don't hard-code a path that might not exist.
ENV NODE_ENV=production

WORKDIR /app

# Copy package files first so Docker caches the npm install layer
COPY --chown=pptruser:pptruser package*.json ./
RUN npm ci --omit=dev

COPY --chown=pptruser:pptruser . .

# Hosts set PORT themselves; 5000 is the local default
ENV PORT=5000
EXPOSE 5000

CMD ["node", "server.js"]
