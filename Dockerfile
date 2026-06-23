# Stage 1: Build the React client application
FROM node:18-alpine AS client-builder
WORKDIR /client
COPY client/package*.json ./
RUN npm ci
COPY client/ ./
RUN npm run build

# Stage 2: Run the Express server and serve frontend static assets
FROM node:18-alpine
WORKDIR /app/server

# Copy server dependencies and install only production dependencies
COPY server/package*.json ./
RUN npm ci --only=production

# Copy server code
COPY server/src ./src
COPY server/index.js ./

# Copy built client bundle to Express public folder
COPY --from=client-builder /client/dist ./public

# Hugging Face Spaces port is 7860
ENV PORT=7860
EXPOSE 7860

# Start the application
CMD ["node", "src/server.js"]
