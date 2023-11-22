FROM node:20.2.0-bullseye-slim

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . /app/
