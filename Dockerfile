# Production stage
FROM node:20-slim as frontend-build
WORKDIR /app/vitereact
COPY vitereact/package*.json ./
RUN npm install --legacy-peer-deps
RUN npm install --save-dev eslint-plugin-import eslint-plugin-react @typescript-eslint/parser @typescript-eslint/eslint-plugin
RUN npm install --save-dev eslint-import-resolver-typescript
COPY vitereact ./
RUN npm run build

# Backend build stage
FROM node:20-slim as backend-builder
WORKDIR /app/backend
COPY backend/package*.json ./
RUN npm install
COPY backend/ ./

# Production stage
FROM node:20-slim
WORKDIR /app/backend

# Copy built frontend from frontend-build stage
COPY --from=frontend-build /app/vitereact/dist /app/backend/public
# Copy backend from backend-builder
COPY --from=backend-builder /app/backend ./

# Set environment variables
ENV NODE_ENV=production
ENV PORT=8080

# Expose port
EXPOSE 8080

# Start the application
CMD ["node", "server.js"]