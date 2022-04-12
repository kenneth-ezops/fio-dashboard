FROM node:14.17.4

RUN apt update

WORKDIR /usr/app

COPY package.json /usr/app/

RUN npm install

COPY . .