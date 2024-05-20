FROM node:21-alpine
WORKDIR /usr/src/app
COPY ./app/package*.json ./
RUN npm install
COPY ./app .
CMD [ "node", "app.js" ]
