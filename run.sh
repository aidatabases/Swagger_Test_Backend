#!/bin/sh
sed -i "s/VUE_APP_API_URL_REPLACE/$VUE_APP_API_URL/g" /usr/share/nginx/html/js/*.js
sed -i "s/VUE_APP_SOCKET_IO_REPLACE/$VUE_APP_SOCKET_IO/g" /usr/share/nginx/html/js/*.js
nginx -g "daemon off;"