FROM node:18.16.1-alpine

WORKDIR /usr/src/app

COPY package*.json ./

COPY tsconfig*.json ./

RUN npm install

COPY apps/log-management ./apps/log-management

COPY apps/shared ./apps/shared

COPY libs ./libs

COPY migrate-mongo-config.default.ts ./

COPY nest-cli.json ./

RUN npm install -g @nestjs/cli@10

RUN nest build log-management -p apps/log-management/tsconfig.app.json

CMD ["node", "dist/apps/log-management/main.js"]
