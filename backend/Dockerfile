FROM node:18-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install --ignore-scripts

COPY . .

EXPOSE ${REACT_APP_BACKEND_SERVER_PORT}

CMD ["node", "index.js"]
