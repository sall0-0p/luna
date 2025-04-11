FROM node:22.14.0

WORKDIR /usr/etc/app

COPY package*.json ./
RUN npm install

COPY . .

CMD [ "node", "index.js" ]