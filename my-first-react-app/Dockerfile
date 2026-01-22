
FROM node:alpine3.18 as build

ARG VITE_TMDB_API_URL
ARG VITE_API_URL
ARG VITE_API_BASE_URL
ARG VITE_TMDB_API_KEY

ENV VITE_TMDB_API_URL=$VITE_TMDB_API_URL
ENV VITE_API_URL=$VITE_API_URL
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
ENV VITE_TMDB_API_KEY=$VITE_TMDB_API_KEY

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:1.23-alpine

RUN rm -rf /usr/share/nginx/html/*

COPY --from=build /app/dist /usr/share/nginx/html

COPY default.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
ENTRYPOINT ["nginx", "-g", "daemon off;"]
