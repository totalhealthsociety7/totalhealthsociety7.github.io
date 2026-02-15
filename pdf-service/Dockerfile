FROM zenika/alpine-chrome:with-node

# Use a lightweight image that already includes Chromium and Node
WORKDIR /usr/src/app

# Copy package files and install production deps
COPY package.json package-lock.json* ./
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
# Make sure npm can write files during install
ENV NPM_CONFIG_UNSAFE_PERM=true
RUN npm install --production --omit=dev --no-audit --no-fund --unsafe-perm || true

# Copy app files
COPY . .

# Expose port and start
ENV PORT=3000
EXPOSE $PORT

CMD ["node", "server.js"]
