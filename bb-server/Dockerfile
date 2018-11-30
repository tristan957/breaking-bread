FROM alpine:latest AS base
RUN apk --no-cache add nodejs-current
RUN apk --no-cache add yarn
WORKDIR /root/
COPY build .

FROM base AS dependencies
RUN cd build/
RUN yarn

FROM base AS release
COPY . .
EXPOSE 10262
CMD node build/src/
