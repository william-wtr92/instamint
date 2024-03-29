# 💾 Database explanation (Knex)

#### ❓ In the Instamint back-end context, we use Knex as a Query Builder

> A QueryBuilder provides an API that is designed for conditionally constructing a DQL query in several steps. It
> provides a set of classes and methods that is able to programmatically build queries, and also provides a fluent API.

## 🔍 Transcations

#### 💡 Transactions in the context of a database, and by extension in use with `Knex`, are a way of `grouping several database operations` into a `single unit of work`.

> This means that if all the operations within the transaction are successful, then
> the transaction is committed and all the data changes are permanently applied to the database.
> On the other hand, if one of the operations fails, the transaction is rolled back, and all the changes made by the
> operations within that
> transaction are reversed, returning the database to its pre-transaction state.

- **For example:**

```ts
route.post("/", async (c: Context): Promise<Response> => {
  /* your logic */
  const trx = await db.transaction() // start a transaction

  try {
    /* your db operations */

    await trx.commit() // commit the transaction if all operations are successful

    return [your_response_here]
  } catch (error) {
    await trx.rollback() // rollback the transaction if an error occurs
  }
})
```

#### The `trx` object is a transaction object that is used to group all the database operations that you want to be part of the transaction.
