# - Build frontend app
FROM node:lts-alpine as builder

COPY package.json yarn.lock .npmrc /app/

WORKDIR /app

RUN yarn install

COPY . /app

RUN yarn build

# - Serve static files
FROM nginx:stable-alpine as prod

COPY --from=builder /app/build/ /usr/share/nginx/html
COPY --from=builder /app/nginx/default.conf /etc/nginx/conf.d/default.conf

EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]