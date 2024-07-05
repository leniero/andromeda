# Use the official Node.js image.
FROM node:16

# Create and change to the app directory.
WORKDIR /usr/src/app

# Copy application dependency manifests to the container image.
COPY package*.json ./

# Install app dependencies.
RUN npm install --only=production

# Copy app files.
COPY . .

# Expose the port that the app runs on.
EXPOSE 5001

# Start the app.
CMD ["npm", "start"]