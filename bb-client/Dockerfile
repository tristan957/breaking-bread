FROM node:11-alpine AS builder
WORKDIR /usr/src/app
COPY . .
RUN yarn \
	&& yarn build

FROM nginx:1-alpine
WORKDIR /var/www/bbread.org
RUN rm -rf /etc/nginx/conf.d
COPY --from=builder /usr/src/app/build/* ./
COPY --from=builder /usr/src/app/nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
EXPOSE 443
