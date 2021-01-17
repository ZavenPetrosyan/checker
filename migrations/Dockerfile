FROM node:12.18.3
WORKDIR /usr/src/app

COPY package.json ./
COPY package-lock.json ./



RUN npm i

COPY . .

ENTRYPOINT ["node", "migrate"]


CMD node latest
