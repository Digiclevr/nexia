# NEXIA Claude Code Agent Docker Image
FROM node:20-alpine AS base

# Install dumb-init for proper signal handling
RUN apk add --no-cache dumb-init curl

WORKDIR /app

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nexia -u 1001 -G nodejs

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production && npm cache clean --force

# Copy source code
COPY --chown=nexia:nodejs ./src ./src

# Create logs directory
RUN mkdir -p logs && chown nexia:nodejs logs

# Switch to non-root user
USER nexia

# Expose port
EXPOSE 7013

# Set environment
ENV NODE_ENV=production
ENV PORT=7013
ENV AGENT_ID=nexia-claude-k8s

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \
  CMD curl -f http://localhost:7013/health || exit 1

# Start the application
ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "src/index.js"]