FROM node:18-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install --ignore-scripts

RUN mkdir node_modules/.cache && chmod -R 770 node_modules/.cache

COPY . .

EXPOSE ${FRONTEND_PORT}

RUN addgroup -S nonroot \
    && adduser -S nonroot -G nonroot

USER nonroot

ENTRYPOINT ["npm", "run", "docker"]
