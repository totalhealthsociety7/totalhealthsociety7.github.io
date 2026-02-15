FROM node:20-bullseye-slim
WORKDIR /app
# install dependencies for puppeteer
RUN apt-get update && apt-get install -y ca-certificates fonts-liberation libnss3 libatk1.0-0 libatk-bridge2.0-0 libx11-6 libx11-xcb1 libxcb1 libxcomposite1 libxdamage1 libxrandr2 libgbm1 libasound2 wget --no-install-recommends && rm -rf /var/lib/apt/lists/*
COPY . /app
RUN cd site-server && npm install --no-audit --no-fund && cd .. && cd pdf-service && npm install --no-audit --no-fund && cd ..
# build step if needed
EXPOSE 3000 3003 3005
CMD ["/bin/bash","-lc","node ../site-server/server.js & node server.js & npx pm2-runtime start /dev/null"]
