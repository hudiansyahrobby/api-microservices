FROM node:15.10.0-buster as base

WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 8082

FROM base as production
RUN npm ci
CMD ["node", "src/index.js"]

FROM base as dev
CMD ["npm", "run", "dev"]
