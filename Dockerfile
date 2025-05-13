# Use an official Node.js runtime as the base image
FROM node:18-alpine AS builder

# Set the working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package.json package-lock.json ./

# Clean npm cache and install ALL dependencies (including dev dependencies)
RUN npm cache clean --force
RUN npm ci

# Copy only necessary source files for building
COPY . .

# Compile TypeScript (build only necessary files)
RUN npm run build

# Second stage: smaller runtime image
FROM node:18-alpine

# Set the working directory
WORKDIR /app

# Copy the build output from the builder stage
COPY --from=builder /app/dist /app/dist
COPY --from=builder /app/node_modules /app/node_modules

# Set environment variables
ENV NODE_ENV=production
ENV PORT=5003

# Expose port from environment variable
EXPOSE ${PORT}

CMD ["node", "dist/server.js"]
