FROM node:lts-alpine

COPY package.json yarn.lock .npmrc /app/

WORKDIR /app

ENV PORT=3000
ENV NODE_ENV="dev"
ENV LOCAL_DOCKER="false"
ENV LOG_LEVEL="INFO"
ENV PG_HOST="postgres_db"
ENV PG_PORT=5432
ENV PG_USERNAME="postgres"
ENV PG_PASSWORD="changeme"
ENV REDIS_HOST="redis_cache"
ENV REDIS_PORT=6379
ENV KAFKA_HOST="kafka"
ENV KAFKA_PORT=9092

RUN yarn install

COPY . /app

RUN yarn build

EXPOSE 3000

CMD [ "yarn", "start" ]