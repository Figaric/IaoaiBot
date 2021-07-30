FROM node

WORKDIR /usr/iaoai-bot/

COPY package.json ./
COPY yarn.lock ./

RUN yarn install

COPY . .
COPY .env .env

RUN yarn build

CMD [ "node", "dist/index.js", "--bind", "0.0.0.0:$PORT" ]