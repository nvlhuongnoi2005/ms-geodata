ARG NODE_IMAGE=registry.internal/base/node:24-alpine
ARG NGINX_IMAGE=registry.internal/base/nginx:1.27-alpine
FROM ${NODE_IMAGE} AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY fe ./fe
COPY tsconfig.json ./
RUN npm run build

FROM ${NGINX_IMAGE}
COPY fe/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/fe/dist /usr/share/nginx/html
EXPOSE 8080

