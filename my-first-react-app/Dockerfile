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
CMD [ "npm", "run", "start"]

FROM nginx:1.23-alpine
WORKDIR /usr/share/nginx/html
RUN rm -rf *
COPY --from=build /app/dist .
EXPOSE 80
ENTRYPOINT ["nginx", "-g", "daemon off;"] 




