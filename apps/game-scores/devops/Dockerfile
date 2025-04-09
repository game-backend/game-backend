FROM node:18.16.1-alpine

WORKDIR /usr/src/app

COPY package*.json ./

COPY tsconfig*.json ./

RUN npm install

COPY apps/game-scores ./apps/game-scores

COPY apps/shared ./apps/shared

COPY libs ./libs

COPY migrate-mongo-config.default.ts ./

COPY nest-cli.json ./

RUN npm install -g @nestjs/cli@10

RUN nest build game-scores -p apps/game-scores/tsconfig.app.json

CMD ["sh", "-c", "npm run migrate:game-scores:up && node dist/apps/game-scores/main.js"]
