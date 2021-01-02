FROM node:lts-alpine

COPY package.json yarn.lock .npmrc /app/

WORKDIR /app

ENV PORT=3001
ENV NODE_ENV="dev"
ENV LOCAL_DOCKER="false"
ENV LOG_LEVEL="INFO"
ENV KAFKA_HOST="kafka"
ENV KAFKA_PORT=9092

RUN yarn install

COPY . /app

RUN yarn build

EXPOSE 3001

CMD [ "yarn", "start" ]