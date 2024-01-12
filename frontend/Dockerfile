FROM node:18-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install --ignore-scripts

RUN addgroup -S nonroot \
    && adduser -S nonroot -G nonroot

RUN mkdir node_modules/.cache && chown -R nonroot:nonroot node_modules/.cache

COPY . .

EXPOSE ${FRONTEND_PORT}

USER nonroot

ENTRYPOINT ["npm", "run", "docker"]
