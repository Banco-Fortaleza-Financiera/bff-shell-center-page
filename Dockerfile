FROM node:24-alpine AS build

WORKDIR /app

ARG BUILD_CONFIGURATION=dev
ENV HUSKY=0
ENV NPM_CONFIG_AUDIT=false
ENV NPM_CONFIG_FUND=false

COPY package*.json ./
RUN npm install --ignore-scripts

COPY . .
RUN npm run build -- --configuration=${BUILD_CONFIGURATION}

FROM nginx:1.27-alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist/bff-shell-center-page/browser /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
