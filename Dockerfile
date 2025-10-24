# Multi-stage image to build client assets and run the Express server via tsx
FROM node:20-alpine AS base
WORKDIR /app

# Install deps first (better cache)
COPY package.json package-lock.json* ./
RUN npm ci --include=dev

# Copy source
COPY . .

# Build client only (server runs via tsx to avoid full type-check build)
RUN npm run build:client

# Runtime stage
FROM node:20-alpine AS runtime
WORKDIR /app

# Copy node_modules and built app
COPY --from=base /app/node_modules ./node_modules
COPY --from=base /app/dist ./dist
COPY --from=base /app/server ./server
COPY --from=base /app/api ./api
COPY --from=base /app/shared ./shared
COPY --from=base /app/vercel.json ./vercel.json
COPY --from=base /app/package.json ./package.json

ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=3000

EXPOSE 3000

# Start Express in production mode; server/index.ts will serve dist/public
CMD ["npx", "tsx", "server/index.ts"]
