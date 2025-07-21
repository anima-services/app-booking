FROM node:18 AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/web-build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 8085
CMD ["nginx", "-g", "daemon off;"]