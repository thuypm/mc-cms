#stage 1

FROM node:16.15.0-alpine as node
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install --silent
COPY . .
RUN npm run build

#stage 2

FROM nginxinc/nginx-unprivileged
COPY ./nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=node /app/build/ /usr/share/nginx/html/app
USER root
COPY run.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

ARG USERNAME=app
ARG USER_UID=1001
ARG USER_GID=$USER_UID
# Create the user
RUN groupadd --gid $USER_GID $USERNAME \
    && useradd --uid $USER_UID --gid $USER_GID -m $USERNAME \
    && apt-get update \
    && apt-get install -y sudo \
    && echo $USERNAME ALL=\(root\) NOPASSWD:ALL > /etc/sudoers.d/$USERNAME \
    && chmod 0440 /etc/sudoers.d/$USERNAME

USER $USERNAME
EXPOSE 80

ENTRYPOINT ["/entrypoint.sh"]
