FROM node:21-alpine

WORKDIR /app

COPY ./app/package-lock.json /app/package-lock.json
COPY ./app/package.json /app/package.json
RUN npm i

COPY ./app /app

CMD [ "npm", "run", "dev", "--host", "0.0.0.0", "--port", "3000" ]
