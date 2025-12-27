FROM node:18-alpine AS build

WORKDIR /app
ENV NODE_ENV=production

COPY package.json package-lock.json ./
RUN npm ci --silent

COPY . .
RUN npm run build

FROM nginx:1.23-alpine AS production

# install curl for healthchecks (small addition)
RUN apk add --no-cache curl

COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 CMD curl -f http://localhost/ || exit 1

CMD ["nginx", "-g", "daemon off;"]