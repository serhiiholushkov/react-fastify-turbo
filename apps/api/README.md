# Quick start

cd example
cp .env.example .env
generate jwt secret: node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
docker compose up -d # start PostgreSQL
pnpm install
pnpm db:migrate # create tables + seed data
pnpm dev

## generate migration

pnpm db:generate --name initial_db_schema

## Docker dev

Docker will start automatically when runnin pnpm dev in turborepo

It was done by adding a docker script to the api package and make dev depend on it.

1. in api package json
   add script: "docker": "docker compose up -d",

2. in turbo.json
   "docker": {
   "cache": false
   },
   "dev": {
   "dependsOn": ["docker"],
   ....
   }
