FROM node:18.16.1-alpine

WORKDIR /usr/src/app

COPY package*.json ./

COPY tsconfig*.json ./

RUN npm install

COPY apps/players-management ./apps/players-management

COPY apps/shared ./apps/shared

COPY libs ./libs

COPY migrate-mongo-config.default.ts ./

COPY nest-cli.json ./

RUN npm install -g @nestjs/cli@10

RUN nest build players-management -p apps/players-management/tsconfig.app.json

CMD ["sh", "-c", "npm run migrate:players-management:up && node dist/apps/players-management/main.js"]
