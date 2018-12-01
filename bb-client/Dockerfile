FROM node:11-alpine AS builder
WORKDIR /usr/src/app
COPY . .
RUN yarn \
	&& yarn build

FROM nginx:1-alpine
WORKDIR /var/www/bbread.org
RUN chown -R $USER:$USER /var/www/bbread.org \
	&&  rm -rf /etc/nginx/conf.d \
	&& chmod -R 755 /var/www
COPY --from=builder /usr/src/app/build/* ./
COPY --from=builder /usr/src/app/nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
EXPOSE 443
