# Stage 1: Build
FROM node:18 AS builder

WORKDIR /app

# 외부 모듈 복사 (LudexWeb3Integration)
COPY ./packages/LudexWeb3Integration ./packages/LudexWeb3Integration

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

# Stage 2: Serve
FROM nginx:stable-alpine

COPY --from=builder /app/build /usr/share/nginx/html

# COPY ./nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]