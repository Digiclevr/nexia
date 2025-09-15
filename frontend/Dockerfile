# =====================================================
# NEXIA Frontend - Production Dockerfile
# =====================================================
# Multi-stage build for optimized React application
# =====================================================

# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY src/ ./src/
COPY public/ ./public/

# Build the React application
RUN npm run build

# Production stage with nginx
FROM nginx:alpine AS production

# Copy custom nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built React app
COPY --from=builder /app/build /usr/share/nginx/html

# Create nginx user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nexia -u 1001

# Set proper permissions
RUN chown -R nexia:nodejs /usr/share/nginx/html && \
    chown -R nexia:nodejs /var/cache/nginx && \
    chown -R nexia:nodejs /var/log/nginx && \
    chown -R nexia:nodejs /etc/nginx/conf.d && \
    touch /var/run/nginx.pid && \
    chown -R nexia:nodejs /var/run/nginx.pid

# Switch to non-root user
USER nexia

# Expose port
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=10s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost/ || exit 1

# Start nginx
CMD ["nginx", "-g", "daemon off;"]