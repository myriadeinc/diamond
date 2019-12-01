FROM node:10.17.0-jessie

  WORKDIR /usr/src/app

  
  RUN chown -R node:node /usr/src/app
  USER node
  # Bundle app source
  COPY . /usr/src/app/

  RUN npm install --production

  # We don't run "npm start" because we don't want npm to manage the SIGTERM signal
  CMD [ "node", "src/main.js" ]