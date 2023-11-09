FROM node:18-alpine

WORKDIR /usr/src/app

RUN apk update && apk add --no-cache bash

COPY package*.json ./

RUN npm install

COPY wait-for-it.sh /usr/src/app/wait-for-it.sh

RUN chmod +x /usr/src/app/wait-for-it.sh

COPY . .

EXPOSE ${BACKEND_SERVER_PORT}

CMD ["bash", "/usr/src/app/wait-for-it.sh", "db:5432", "--", "node", "index.js"]
