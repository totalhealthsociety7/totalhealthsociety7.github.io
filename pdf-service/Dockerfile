FROM zenika/alpine-chrome:with-node

# Use a lightweight image that already includes Chromium and Node
WORKDIR /usr/src/app

# Copy package files and install production deps
COPY package.json package-lock.json* ./
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
RUN npm install --production --omit=dev --no-audit --no-fund || true

# Copy app files
COPY . .

# Expose port and start
ENV PORT=3000
EXPOSE $PORT

CMD ["node", "server.js"]
