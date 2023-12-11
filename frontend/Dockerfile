FROM node:18-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install --ignore-scripts

COPY . .

EXPOSE ${FRONTEND_PORT}

CMD ["npm", "run", "docker"]