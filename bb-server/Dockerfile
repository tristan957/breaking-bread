FROM alpine:latest AS base
RUN apk --no-cache add nodejs-current
RUN apk --no-cache add yarn
WORKDIR /root/
COPY build .
RUN cd build/

FROM base AS dependencies
RUN yarn

FROM base AS release
EXPOSE 10262
CMD node src/
