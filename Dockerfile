# Use official Node.js image to build the app
FROM node:18 AS build
WORKDIR /app
COPY package*.json ./
COPY public ./public
COPY src ./src
RUN npm install && npm run build

# Use nginx to serve the build
FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"] 