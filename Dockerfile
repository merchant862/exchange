# Use the official Node.js image
FROM node:18

# Create and set the working directory
RUN mkdir -p /zippo/config
WORKDIR /zippo

# Copy the application code into the working directory
COPY . /zippo

# Install dependencies
RUN npm install

# Run the Sequelize CLI commands for production
RUN NODE_ENV=production npx sequelize-cli db:create \
    && NODE_ENV=production npx sequelize-cli db:migrate

# Expose the port
EXPOSE 3000

# Start the application
CMD ["npm", "run", "start"]
