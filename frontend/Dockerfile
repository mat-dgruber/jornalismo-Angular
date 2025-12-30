# Stage 1: Build the Angular application
FROM node:20 AS build

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build --configuration=production

# Stage 2: Serve the application with Nginx
FROM nginx:alpine

# Copy the build artifacts from the correct directory (nested browser folder)
COPY --from=build /app/dist/jornalismo-angular/browser /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80
