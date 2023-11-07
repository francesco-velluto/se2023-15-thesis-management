FROM node:18-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE ${BACKEND_SERVER_PORT}

CMD ["node","index.js"]