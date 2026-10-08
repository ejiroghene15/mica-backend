# Mica Backend

## Tech Stack
- Framework - NestJs
- Database - Prisma Postgres
- Authentication - Passport

## Documentation
- [MicaCheckin](./docs/mica-checkin.md)
- [MicaLibrary](./docs/mica-library.md)

## Project Setup
- Clone the repository
- Navigate into the project directory and install dependencies
```bash
npm install
```
- Copy `.env.sample` to `.env` and configure your environment variables
- Start the project
```bash
npm run start
# or
npm run start:dev
```

## Module overview

### MicaCheckin
The `mica-checkin` module records a user's mood and emotional intensity. It stores entries in the `Layers` table and provides endpoint-level aggregation for user mood summaries.

### MicaLibrary
The `library` module exposes curated resource content, and supports filtering by kind, category, search, and featured status. Results are cached for improved performance.
