FROM node:15.10.0-buster as base

WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 8000

FROM base as production
RUN npm ci
CMD ["npm", "start"]

FROM base as dev
RUN npm i -g nodemon
CMD ["npm", "run", "dev"]
