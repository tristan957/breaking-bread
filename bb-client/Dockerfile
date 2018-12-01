FROM node:11-alpine AS builder
WORKDIR /usr/src/app
COPY . .
RUN yarn \
	&& yarn build

FROM alpine:latest
RUN apk update
RUN apk add nginx
RUN adduser -D -g 'bbread' bbread
WORKDIR /var/www/bbread.org
RUN chown -R bbread:bbread /etc/nginx
RUN chown -R bbread:bbread /var/www
RUN rm -rf /etc/nginx/conf.d
RUN chmod -R 755 /var/www
COPY --from=builder /usr/src/app/build/* ./
COPY --from=builder /usr/src/app/nginx.conf /etc/nginx/nginx.conf
CMD [ "nginx" ]
EXPOSE 80
EXPOSE 443
