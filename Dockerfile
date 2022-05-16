FROM nginx:latest

COPY nginx.conf /etc/nginx/nginx.conf

COPY /html /usr/establish/nginx/
