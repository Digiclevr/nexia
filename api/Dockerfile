# =====================================================
# NEXIA API - Production Dockerfile
# =====================================================
# Multi-stage build for optimized production image
# =====================================================

# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY knexfile.js ./

# Install dependencies (including devDependencies for build)
RUN npm ci

# Copy source code
COPY src/ ./src/

# Build application (if you have a build step)
# RUN npm run build

# Production stage
FROM node:18-alpine AS production

# Create app user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nexia -u 1001

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./
COPY knexfile.js ./

# Install production dependencies only
RUN npm ci --only=production && npm cache clean --force

# Copy built application
COPY --from=builder --chown=nexia:nodejs /app/src ./src

# Create logs directory
RUN mkdir -p logs && chown nexia:nodejs logs

# Switch to non-root user
USER nexia

# Expose port
EXPOSE 3001

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
    CMD node -e "require('http').get('http://localhost:3001/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) })"

# Start application
CMD ["node", "src/server.js"]