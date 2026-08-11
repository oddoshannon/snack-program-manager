FROM node:22-slim

WORKDIR /app/backend

COPY backend/package*.json ./
RUN npm ci --omit=dev

COPY backend/server.js ./
COPY backend/lib ./lib
COPY backend/routes ./routes
COPY frontend/public /app/frontend/public

ENV PORT=8080
ENV SERVE_FRONTEND=true
ENV FRONTEND_PUBLIC_DIR=/app/frontend/public
EXPOSE 8080

CMD ["npm", "start"]
