# ⚡️ Cron Jobs

> Cron jobs are scheduled tasks that run at specific times. They are used to automate repetitive tasks like backups,
> updates, and more.

## 📚 Resources

- [📖 Concept Explained](https://www.ostechnix.com/a-beginners-guide-to-cron-jobs/)
- [📦 Node Schedule](https://www.npmjs.com/package/node-schedule)

## 💡 Examples

- Instamint implements cron jobs to automate delete of account after 6 months since deactivation:

```ts
export const deleteAccountsJob = scheduleJob(
  "0 0,12 * * *", // Run every day at 12:00 AM and 12:00 PM
  async () => {
    const payload = {
      /* Secure and dynamic payload with expiration value */
    }

    const jobJwt = signJwt(payload) // Create a job token

    await redis.set() // Set the job token in redis

    const { statusCode } = await request(
      "htpps://api.instamint.com/v1/accounts/delete", // API endpoint to delete accounts
      {
        method: "POST", // HTTP method
        body: JSON.stringify({}), // If you need to send any data
        headers: {
          // You can add any headers
          "Content-Type": "application/json",
        },
      }
    )

    if (statusCode !== 200) {
      await redis.del() // After the job is done, delete the job token from redis
    }
  }
)
```

⚠️ **You need to protect your cron jobs via various security measures like JWT tokens, rate limiting, and more.**

## 🚀 Tips

- If your cron jobs call external API, you can use `undici` to make HTTP requests:

```bash
pnpm add undici
```

- To start a project with cron jobs, install `ts-node` for production & `nodemon` for development
  with **Hot Module Replacement** `HMR`:

```bash
pnpm add ts-node nodemon
```

- 📝 `package.json`:

```json
{
  "scripts": {
    "start": "ts-node src/index.ts",
    "dev": "nodemon --exec ts-node src/index.ts"
  }
}
```
