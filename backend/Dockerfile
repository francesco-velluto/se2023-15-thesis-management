FROM node:18-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install --ignore-scripts

COPY . .

EXPOSE ${REACT_APP_BACKEND_SERVER_PORT}

RUN addgroup -S nonroot \
    && adduser -S nonroot -G nonroot

USER nonroot

ENTRYPOINT ["npm", "start"]