FROM node:22-alpine AS build
WORKDIR /app
RUN apk add --no-cache python3 make g++
COPY package.json ./
RUN npm install --no-audit --no-fund
COPY tsconfig.json ./
COPY src ./src
RUN npm run build

FROM node:22-alpine
WORKDIR /app
ENV NODE_ENV=production
RUN apk add --no-cache python3 py3-pip && \
    pip3 install --break-system-packages --no-cache-dir edge-tts
COPY --from=build /app/package.json ./
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
RUN mkdir -p /data/tts-cache
EXPOSE 3000
HEALTHCHECK CMD wget -qO- http://localhost:3000/api/health >/dev/null || exit 1
CMD ["node", "dist/index.js"]
