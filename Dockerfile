# build stage
FROM node:10.15.0-alpine as build-stage
WORKDIR /app
COPY . .
RUN npm config set http-proxy http://10.248.35.41:3128
RUN npm config set https-proxy http://10.248.35.41:3128
RUN npm install
RUN npm run build

# production stage
FROM nginx:1.13.12-alpine as production-stage
ADD default.conf /etc/nginx/conf.d/default.conf
COPY --from=build-stage /app/dist /usr/share/nginx/html
ENV VUE_APP_API_URL https://manageapi.cloud.gov.in
ENV VUE_APP_SOCKET_IO https://socketio.devcloud.nic.in
EXPOSE 80
COPY ./run.sh /
RUN chmod +x /run.sh
CMD ["/run.sh"]