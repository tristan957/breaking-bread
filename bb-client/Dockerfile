FROM node:11-alpine AS builder
WORKDIR /usr/src/app
COPY . .
RUN yarn \
	&& yarn build

FROM nginx:1
RUN rm -rf /etc/nginx/conf.d
COPY bbread.org.conf /etc/nginx/sites-enabled/
COPY --from=builder /usr/src/app/build/ /var/www/bbread.org/
EXPOSE 10263
CMD [ "nginx", "-g", "daemon off;" ]
