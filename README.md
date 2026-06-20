## Add a package

pnpm --filter <project-name> add <package-name>
Example: pnpm --filter @repo/api add drizzle-orm

## Running commands for specific repo

pnpm --filter <project-name> <command>
Example: pnpm --filter @repo/api db:seed
