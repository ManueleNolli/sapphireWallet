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
RUN rm -rf ./src/main.ts
RUN mv ./src/main.prod.ts ./src/main.ts

# Expose the port your app will run on
EXPOSE 3001

# Define the command to run your application
CMD ["yarn", "run", "start:dev"]
