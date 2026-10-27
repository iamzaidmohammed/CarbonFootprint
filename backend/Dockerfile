# Official Puppeteer image: already contains Chrome and all its system libraries
FROM ghcr.io/puppeteer/puppeteer:24

# Don't download a second Chrome; use the one in the image
ENV PUPPETEER_SKIP_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/google-chrome-stable \
    NODE_ENV=production

WORKDIR /app

# Copy package files first so Docker caches the npm install layer
COPY --chown=pptruser:pptruser package*.json ./
RUN npm ci --omit=dev

COPY --chown=pptruser:pptruser . .

# Hosts set PORT themselves; 5000 is the local default
ENV PORT=5000
EXPOSE 5000

CMD ["node", "server.js"]
