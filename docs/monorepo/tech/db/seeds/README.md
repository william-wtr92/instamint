# 🧪 Seeds

> Seeds are used to populate the database with initial data. This is useful for testing and development purposes.

## 🔨 Usage

- To run the seeds, use the following command at `root`:

```bash
pnpm run kn:seed
```

- To create a new seed file, go on your seeds folder and create a new file with the following format:

```ts
import knex from "knex"

const seed = async () => {
  const db = knex(/* your db config */) // Initialize the database connection

  await db("your_table_name").del() // Delete the existing data

  const users = [
    /* your data here */
  ] // Define the new data

  await db("your_table_name").insert(users) // Insert the new data
}

module.exports = { seed } // Export the seed function
```

## ⚠️ Requirements

- In your database configuration file, make sure to set the `seeds` property to the path of your`seeds` folder.

```ts
const config = {
  /* your other configurations */
  client: "pg",
  connection: {
    /* your connection details */
  },
  migrations: {
    /* your migrations configuration */
  },
  seeds: {
    directory: "./src/db/seeds", // Path to your seeds folder
    loadExtensions: [".ts"], // Load TypeScript files
  },
  /* your other configurations */
}
```
