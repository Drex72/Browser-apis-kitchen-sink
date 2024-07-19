FROM node:18-alpine

WORKDIR /app

COPY package.json .

RUN npm install

RUN npm i -g serve

COPY . .

RUN npm run build

EXPOSE 3000

CMD [ "serve", "-s", "dist" ]

# Intersection Observer API
# Clipboard API
# Network Information API
# Resize Observer API
# Battery Status API
# Web Audio API
# Credential Management API
# PerformanceObserver API
# Device Orientation
# File Access Api