# Flights Service

## Description

Read the requirements here: [Coding Challenge](./CODING%20CHALLENGE.md).
Uses Nest.js/TypeScript starter repository.

A `fights` module is available, it just uses axios to request flights from all sources.
It merges and de-duplicates results before returning.
Each individual "source" is cached for one hour in-memory.

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```
