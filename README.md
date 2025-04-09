

## Description
A simple RESTful API for a mobile game backend that mangages player profiles, game scores and client logs.

The backend is a <a href="https://docs.nestjs.com/" target="_blank">NestJS</a> multi-app repository, each app is an individual service that can be individually deployed.
All services are containerized and orchestrated with docker-compose.

There are 4 microservices:
* Players Management Service - 
    Handles player CRUD and stores player info in MongoDB:
    * Create new player profiles
    * Update and delete existing players
    * Retrieve player info by ID

* Game Scores Service - 
    Accepts and stores game score submissions:
    * Accepting score submissions
    * Storing scores in MongoDB
    * Emitting score events to Kafka for immediete updating of scores and leaderboard
    
* Leaderboard Service -
    Maintains a Redis-backed leaderboard, built from score submissions:
    * Listens for score events via Kafka
    * Increments player scores in a Redis sorted set
    * Exposes a paginated /leaderboard endpoint withplayer data from players-management
    * Rebuilds its state from MongoDB if Redis is empty for example after a restart

* Logs Management Service - 
    Accepts client logs and processes them through a Kafka-based pipeline with batching and rate limiting:
    * Immediately acknowledges receipt
    * Pushes log events into Kafka
    * A background worker service consumes events, and writes to MongoDB
    * Uses Redis for rate limiting and durable queuing in case of failure


## Installation , Setup and running locally
There are 2 ways to setup and run this project locally:
1. using nestjs dev mode:
    ```bash
    $ npm install
    ```
    and then run each service individually as need:
    ```bash
    $ npm run start:(players-management|game-scores|leaderboard|log-management)
    ```
    this approach assumes the neccasary environment variables from sample.env are
    correct and mongodb/kafka/redis are already setup(in the utils directory there are scripts for starting docker instances of each dependency).

2. using docker-compose:
    This project uses Docker Compose to run all services and dependencies (MongoDB, Redis, Kafka) in one command.
    Make sure no other services are running on ports 3000–3009, 27017, 6379, or 9092.
    ```bash
    $ docker-compose up --build
    ```
    This will:
    * Build all microservices (players-management, game-scores, leaderboard, logs-management)

    * Start MongoDB, Redis, Kafka, and Zookeeper

    * Automatically create required indexes and topics

    * Run all services in a shared network for cross-service communication

### Ports and Access:	
| Service              | Host URL                                                                                  |
| -------------------- |:-----------------------------------------------------------------------------------------:|
| Player Management    | http://localhost:3001                                                                     | 
| Game Scores          | http://localhost:3002                                                                     |
| Leaderboard          | http://localhost:3003                                                                     |
| Logs Management      | http://localhost:3004                                                                     |
| MongoDB              | mongodb://\${MONGO_ROOT_USERNAME}:${MONGO_ROOT_PASSWORD}@localhost:27017/?authSource=admin |
| Kafdrop              | http://localhost:9000                                                                     |

* make sure to review sample.env for neccessary environment variables.

## API Documentation

When running locally in NODE_ENV=dev mode, you can visit:

| Service              | Host URL                                                                                  |
| -------------------- |:-----------------------------------------------------------------------------------------:|
| Player Management    | http://localhost:3001/api/docs                                                            | 
| Game Scores          | http://localhost:3002/api/docs                                                            |
| Leaderboard          | http://localhost:3003/api/docs                                                            |
| Logs Management      | http://localhost:3004/api/docs                                                            |

Swagger UI is disabled in production environments.

There is a Postman 2.1 collection available in the docs directory.

### Viewing Without Running the Backend
/docs includes a swagger-spec.json file per service that can be previewed using the official Swagger Editor:

just paste the spec into the https://editor.swagger.io editor and you can interact with the swagger ui documentation
of the routes.

Some routes are marked as internal-only and are protected using a shared internal token. These routes are not intended for public or client access and are only used for service-to-service communication.

## Internal Communication and Cache mechanisms
Services communicate with each other using a combination of Kafka, HTTP, and Redis, depending on the use case.

### Service-to-Service Communication:
* HTTP is used for direct requests (e.g., leaderboard-service fetches player info from player-management)

* Services use Docker Compose service names for internal calls for example http://players-management:3000

* Internal routes are protected using a shared secret token via the Authorization header: Authorization: Bearer <INTERNAL_API_TOKEN>

Kafka is used for asynchronous communication and decoupling:

* game-scores emits score.submitted events

* leaderboard listens to those events to update the leaderboard in Redis

* logs-management publishes and consumes log data through Kafka for scalable log processing

Kafka allows services to retry or recover if a service is temporarily unavailable, ensuring no data loss.


Redis is used in two ways:

* Leaderboard state: stored as a sorted set (ZSET) for fast pagination and retrieval

* Rate-limited durable queuing in logs-management to ensure log events aren’t lost if MongoDB is down or under pressure

* Redis allows quick in-memory operations, while MongoDB remains the source of truth.

## Test

```bash

# e2e tests
$ npm run test:all
```
or individually
```bash
$ npm run test:players-management 
$ npm run test:game-scores 
$ npm run test:leaderboard 
$ npm run test:log-management
```

## Future Improvement
* Unit tests

* Logger lib

* Request context lib

* JWT Authentication

* Role-Based Access Control 

* API Gateway

* Metrics and Observability

* Admin Dashboard to set different configurations and env vars

* Blue/Green deployment model

* logs management service , log severity