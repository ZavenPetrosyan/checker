FROM node:12.18.3

WORKDIR /usr/src/app

COPY package.json ./
COPY package-lock.json ./

RUN npm i

COPY . .

RUN npm run build

CMD npm start