## Add a package

pnpm --filter <project-name> add <package-name>
Example:

```
pnpm --filter @repo/api add drizzle-orm
```

```
pnpm --filter @repo/api add "@repo/api-rpc@workspace:*"
```

## Running commands for specific repo

pnpm --filter <project-name> <command>
Example:

```
pnpm --filter @repo/api db:seed
```
