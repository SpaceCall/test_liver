# syntax=docker/dockerfile:1
FROM node:18-alpine
RUN npm install -g nodemon
WORKDIR /usr/src/app

ENV NODE_ENV=production


COPY ["package.json", "package-lock.json*", "./"]

RUN npm install

COPY . .

EXPOSE 8080

CMD npm run start:dev