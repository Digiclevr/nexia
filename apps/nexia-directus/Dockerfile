FROM node:22-alpine AS base

# Install system dependencies
RUN apk add --no-cache \
    curl \
    sqlite \
    postgresql-client

WORKDIR /directus

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy application code
COPY . .

# Copy OGER intelligence service and extensions
COPY intelligence-service.js ./
COPY extensions/ ./extensions/

# Create uploads directory
RUN mkdir -p /directus/uploads && \
    chown -R node:node /directus

# Switch to non-root user
USER node

# Expose port
EXPOSE 7012

# Environment variables
ENV NODE_ENV=production
ENV PORT=7012
ENV HOST=0.0.0.0

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
  CMD curl -f http://localhost:7012/server/health || exit 1

# Start Directus
CMD ["npx", "directus", "start"]