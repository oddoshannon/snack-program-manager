FROM node:22-slim

WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev

COPY server.js ./
COPY lib ./lib
COPY routes ./routes

ENV PORT=8080
EXPOSE 8080

CMD ["npm", "start"]
