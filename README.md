# minerva

To install dependencies:

```bash
bun install
```

To run:

```bash
bun run index.ts
```

This project was created using `bun init` in bun v1.1.7. [Bun](https://bun.sh) is a fast all-in-one JavaScript runtime.

## DB related

if we make some changes in schema:

- generate with `bunx drizzle-kit generate:pg`
- migrate with `bun migrate.ts`
