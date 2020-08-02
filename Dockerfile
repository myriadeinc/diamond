FROM node:12.18.3-buster-slim
  RUN chown -R node:node /usr/src/app
  # Fuck it
  RUN chmod -R 777 /usr/src/app
  USER node
  # Bundle app source
  COPY . /usr/src/app/
  # fuck
  RUN mkdir node_modules
  RUN chmod -R 777 ./node_modules

  RUN npm install --production

  # We don't run "npm start" because we don't want npm to manage the SIGTERM signal
  CMD [ "node", "src/main.js" ] 