#!/bin/bash
chown $USER:$USER -r /usr/share/nginx/html/app
nginx -g 'daemon off;'
