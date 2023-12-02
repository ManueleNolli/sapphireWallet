# Use an official Node.js image as the base image
FROM node:18

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install project dependencies
RUN yarn install

# Copy the rest of the application code to the working directory
COPY .. .
RUN rm -rf ./src/api-gateway.module.ts
RUN mv ./src/api-gateway.module.prod.ts ./src/api-gateway.module.ts

# Expose the port your app will run on
EXPOSE 3000

# Define the command to run your application
CMD ["yarn", "run", "start:dev"]
