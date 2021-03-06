FROM node:12.18.3-buster
  WORKDIR /usr/src/app

  RUN chown -R node:node /usr/src/app
  
  USER node
  # Bundle app source
  COPY . /usr/src/app/
  
  RUN mkdir node_modules
  RUN chmod -R 777 ./node_modules

  RUN npm install --production

  # We don't run "npm start" because we don't want npm to manage the SIGTERM signal
  CMD [ "node", "src/main.js" ] 