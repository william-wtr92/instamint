# 💾 Database explanation (Knex)

#### ❓ In the Instamint back-end context, we use Knex as a Query Builder

> A QueryBuilder provides an API that is designed for conditionally constructing a DQL query in several steps. It
> provides a set of classes and methods that is able to programmatically build queries, and also provides a fluent API.

## 📚 Resources

- [📖 Knex.js](http://knexjs.org/)

## 📚 Table of Contents

- [🔍 Migrations](./migrations/README.md)
- [🔍 Seeds](./seeds/README.md)
- [🔍 Transactions](./transactions/README.md)

## ⚠️ Requirements

- Setup your `knexfile.ts` at root of your `back-end` with the following content:

```ts
import appConfig from "./src/db/config/config"

export default appConfig.db // Export the db configuration
```

- Make sure you are in commonjs mode in your `tsconfig.json`: ⚠️ **Only to write migrations and seeds in ESM syntax**

```json
{
  "compilerOptions": {
    "module": "commonjs"
  }
}
```

- And make sure you are in common js mode in your `package.json`:

```json
{
  "type": "commonjs"
}
```
