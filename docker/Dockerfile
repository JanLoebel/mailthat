### STEP 1: build ###
FROM node:14-alpine as builder
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install --quiet
COPY . .
RUN npm run build

### STEP 2: RUN ###
FROM node:14-alpine
ENV NODE_ENV=production
ENV LOG_LEVEL=info
ENV CONFIG_PATH=/config/config.json

COPY config/config.json /config/config.json
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install --only=prod --quiet
COPY --from=builder /usr/src/app/dist /usr/src/app
USER node
CMD ["node", "index.js"]
