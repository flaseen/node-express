# 1. Use official Node.js LTS (Alpine version for smaller image size)
FROM node:22.17.0-alpine3.22

# 2. Set working directory
WORKDIR /app

# 3. Copy only package files first (better caching)
COPY package*.json ./

# 4. Install dependencies
RUN npm ci

# 5. Copy source code
COPY . .

# 6. Expose port (default: 3000)
EXPOSE 3000 

# 7. Start the app
CMD ["npm", "start"]