FROM node:18-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install --ignore-scripts

RUN addgroup -S nonroot \
    && adduser -S nonroot -G nonroot

COPY . .

RUN chmod 777 -R uploads

EXPOSE ${REACT_APP_BACKEND_SERVER_PORT}

USER nonroot

ENTRYPOINT ["npm", "start"]