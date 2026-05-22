# Stage 1: build
FROM node:20-alpine AS builder
WORKDIR /app

COPY package*.json ./
COPY prisma/ ./prisma/
COPY scripts/ ./scripts/
COPY tsconfig*.json ./
COPY vite.config.ts ./
COPY eslint.config.js ./
COPY index.html ./

RUN npm ci

COPY src/ ./src/
COPY server/ ./server/
COPY public/ ./public/

RUN npm run build

# Stage 2: production
FROM node:20-alpine AS production
WORKDIR /app

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/scripts ./scripts
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules

RUN mkdir -p dist/public/uploads

EXPOSE 4004

CMD ["node", "dist/server/index.mjs"]
