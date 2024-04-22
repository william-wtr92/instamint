# 🔗 Migrations

> Migrations are a way to make database schema changes in a controlled and predictable way.

## 🔨 Usage

- With `knex` installed, you can create a new migration file using the following command at `root`:

```bash
pnpm run kn:make <migration_name>
```

- To `run` the migrations, use the following command at `root`:

```bash
pnpm run kn:latest
```

- To `rollback` the last migration, use the following command at `root`:

```bash
pnpm run kn:rollback
```

## ⚠️ Requirements

- In your database configuration file, make sure to set the `migrations` property to the path of your `migrations`
  folder.

```ts
const config = {
  db: {
    client: "pg",
    connection: {
      /* your connection details */
    },
    migrations: {
      directory: "./src/db/migrations", // Path to your migrations folder
      loadExtensions: [".ts"], // Load TypeScript files
      stub: "./src/db/migration.stub", // Path to your migration stub file
    },
    seeds: {
      /* your seeds configuration */
    },
  },
}
```

## 💡 How to create a migration file

- After running the `kn:make` command, a new migration file will be created in your `migrations` folder.

```ts
import type { Knex } from "knex"

export const up = async (knex: Knex): Promise<void> => {
  // Run this when you run the command : pnpm run kn:latest
  await knex.schema.createTable(
    "your_table_name",
    (table: Knex.TableBuilder) => {
      /* your table schema here */
    }
  )
}

export const down = async (knex: Knex): Promise<void> => {
  await knex.schema.dropTable("your_table_name") // Drop the table if the migration is rolled back
}
```

## 📖 Template `migration.stub` for TypeScript

```stub
import type { Knex } from 'knex';

export const up = async (knex: Knex): Promise<void> => {
  return knex.schema.createTable('', (table: Knex.TableBuilder) => {
  });
};

export const down = async (knex: Knex): Promise<void> => {
  return knex.schema.dropTable('');
};
```
