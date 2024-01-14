# base image
FROM node:18.18.0

# set working directory
WORKDIR /app

# copy application files to the container
COPY . .

# install dependencies
RUN npm install

# expose the port 3000
EXPOSE 3000

# start the application
CMD ["npm", "run", "dev"]