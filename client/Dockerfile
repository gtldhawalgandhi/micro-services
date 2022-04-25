FROM node:14.19.1-alpine as base
WORKDIR /app
COPY package.json yarn.lock package-lock.json ./
RUN yarn install
COPY ./ ./
CMD ["yarn", "build"]

FROM caddy:2.4.6-alpine as client
COPY ./Caddyfile /etc/caddy/Caddyfile
COPY --from=base /app/build /srv
EXPOSE 80

