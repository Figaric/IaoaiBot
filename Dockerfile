FROM node

WORKDIR /usr/iaoai-bot

COPY ./package.json .
COPY ./yarn.lock .

RUN yarn install --production

ADD ./dist ./dist
COPY ./.env ./.env
COPY ./iaoaibot-secrets.json ./iaoaibot-secrets.json

CMD [ "node", "/usr/iaoai-bot/dist/index.js", "--bind", "0.0.0.0:$PORT" ]