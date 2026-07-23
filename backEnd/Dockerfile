
FROM node:24-alpine

# SET WORKING DIRECTORY
WORKDIR  /app

# COPY PACKAGES FIRST
COPY package*.json ./

# --omit=dev means skip nodemon and other dev tools
RUN npm install --omit=dev

# COPY EVERYTHING
COPY . .

# PORT
EXPOSE 3000

# RUN COMMAND
CMD ["node", "server.js" ]