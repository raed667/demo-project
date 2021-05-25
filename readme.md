# Demo-Project: Full-stack TypeScript application

![backend](https://github.com/RaedsLab/demo-project/workflows/backend/badge.svg)
![backend-realtime](https://github.com/RaedsLab/demo-project/workflows/backend-realtime/badge.svg)
![frontend](https://github.com/RaedsLab/demo-project/workflows/frontend/badge.svg)

![chart](https://i.imgur.com/6ELu2fx.png)

A demo project to showcase different technologies and how they work together.
The ultimate goal is to have a full-stack, production-ready application.

![ui](https://i.imgur.com/W7Armo5.png)

You can use the `setup.sh` script to run it locally.

[![asciicast](https://asciinema.org/a/lKhIcJG0YXbZfvkOpoWtzMUrM.svg)](https://asciinema.org/a/lKhIcJG0YXbZfvkOpoWtzMUrM)

The goal for this project is to be a "domain driven" starter that will help you
bootstrap a new application in seconds and just work your business logic instead of all the bootstrapping.

Inspired by [ts-app](https://github.com/lukeautry/ts-app), this project aims to be a little lighter version of that project, with clearer separation of frontend and backend code. And a bigger focus and metrics and monitoring.

## Where do I start

You can start by running:

```sh
sh ./setup.sh
```

You can also start the project locally:

```sh
yarn dev
```

After you finish you can clean your setup with:

```sh
sh ./clean.sh
```

## Status

Work in progress.

## System Requirements

- [Node.js 12+](https://nodejs.org/en/download/)
- [docker](https://www.docker.com) and [docker-compose](https://docs.docker.com/compose)
- [yarn](https://yarnpkg.com/en)

## Technologies Used

- [TypeScript](http://www.typescriptlang.org/)
- Backend

  - [Node.js](https://nodejs.org)
  - [Express](https://expressjs.com/)
  - [tsoa](https://github.com/lukeautry/tsoa)
    - Generates Express Routes from TypeScript controllers
    - Generates [OpenAPI ("Swagger")](https://swagger.io/docs/specification/about) specification, enabling automatic documentation
  - [SQLite](https://www.sqlite.org/index.html) as a local development database
  - [PostgreSQL](https://www.postgresql.org/) as RDBMS
    - [TypeORM](http://typeorm.io) for code-first database migrations and ORM queries
  - [Redis](https://redis.io/) for caching

- Developer environment

  - [docker](https://www.docker.com/) and [docker-compose](https://docs.docker.com/compose) for non-Node.js project dependencies
  - VSCode, eslint and prettier for a consistent development experience
  - A setup script `setup.sh` to help you get started in a guided way.

- Frontend

  - [create-react-app](https://github.com/facebook/create-react-app)
  - [material-ui](https://material-ui.com/)
  - [final-form](https://github.com/final-form/final-form)

- Testing
  - TBD

## Todo

A high-level list of

- [x] SQLite in dev
- [x] PG in docker
- [x] Redis for cache
- [x] Setup script
- [x] Setup initial DB data in a migration
- [x] Prometheus for metrics
- [x] Grafana for monitoring
- [x] Frontend: CRA for client
- [x] Frontend: validation using Yup, mui-rff
- [x] Cache redis on get /users query
- [x] Kafka producer for real-time events
- [x] Nginx for web-server
- [x] Kafka consumer for real-time events
- [x] Web-Socket
- [x] Start-up script
- [ ] Secure Nginx
- [ ] Generate client from swagger.json
- [ ] Deploy on a production environment (OVH, GCP, AWS..)


[![FOSSA Status](https://app.fossa.com/api/projects/git%2Bgithub.com%2FRaedsLab%2Fdemo-project.svg?type=large)](https://app.fossa.com/projects/git%2Bgithub.com%2FRaedsLab%2Fdemo-project?ref=badge_large)
