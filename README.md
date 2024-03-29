# 🔮 Instamint Project

Instamint is a young startup which allows _**NFTs & crypto enthusiasts**_ to discover, collect and exchange
_**NFTs and much more!**_

The main objective of the project is to develop a platform that complies with the specifications detailed in the call
for tenders, focusing on innovation, **_sustainability and the integration of Web3 technologies_**. It aims to offer an
exceptional user experience through an intuitive and engaging user interface, while strictly complying with security and
accessibility standards and legal frameworks, particularly with regard to data protection. The project will also seek to
assess and minimise its ecological footprint, affirming its commitment to sustainable development.

## 🐐 Contributors

- [@William](https://github.com/william-wtr92) > Fullstack Developer / Team Leader
- [@Pascal](https://github.com/Scalpal) > Fullstack Developer
- [@Thomas](https://github.com/Thomas-De-Oliveira) > Fullstack Developer
- [@Hugo](https://github.com/vaillanh) > Fullstack Developer

## 🔨 Setup

### 🐳 From Docker environment

- Make sure you have **Docker** installed on your machine.
- Setup ur **.env** file with the following
  variables -> [See example](https://github.com/william-wtr92/instamint/blob/main/.env.example).

- To run this project clone this repository and run it locally using **docker commands**. <br><br>

  - **🚀 Production:** <br><br>
    **Start the project:**

    ```bash
    make prod-up
    ```

    **Stop the project:**

    ```bash
    make prod-down
    ```

  - **⚙️ Development:** <br><br>
    **Start the project:**

    ```bash
    make dev-up
    ```

    **Stop the project:**

    ```bash
    make dev-down
    ```

### 🔑 From the local environment

- You need to have **PNPM** installed, if not you can install it by following
  the [instructions](https://pnpm.io/installation).
- Setup ur **.env** file with the following
  variables -> [See example](https://github.com/william-wtr92/instamint/blob/main/.env.example).
- Install [PostgreSQL](https://www.postgresql.org/download/) & [Redis](https://redis.io/docs/install/install-redis/) on
  your local machine.
- Install the dependencies by running `pnpm install` at `root`.
- Start the `development server` by running the following commands at `root`:

  ##### **🖥️ Front - Instamint Webapp:**

  ```bash
  pnpm run dev:webapp
  ```

  ##### **🖥️ Back - Instamint Business:**

  ```bash
  pnpm run dev:business
  ```

  ##### **🖥️ Back - Instamint Files:**

  ```bash
  pnpm run dev:files
  ```

### **🔗 Access the project:** <br>

- **[Front - Instamint Webapp](http://localhost:3000)** run on port `3000`
- **[Back - Instamint Business](http://localhost:3001)** run on port `3001`
- **[Back - Instamint Files](http://localhost:3002)** run on port `3002`

## ⭐️ Tech Stack

- **Client:** [_Next.js_](https://nextjs.org/docs) & _TypeScript_
- **Server**: [_HonoJS_](https://hono.dev/getting-started/basic) & _TypeScript_
- **Database**: _PostgreSQL_
- **Mockup**: [
  _Figma_](https://www.figma.com/file/0vj1ZxDcGJ6YeGLdaouf2u/UI-UX-design?type=design&node-id=0-1&mode=design&t=BJOmZmtqybA)
- **CI/CD**: _Github Actions_
- **Testing**: _Jest_
- **Deployment**: [_Vercel_](https://vercel.com/)
- **Monitoring**: _Sentry_
- **Containerization**: _Docker_

## 💡 Other Tools

- **Agile Methodology**: [_Jira_](https://project-william.atlassian.net/jira/software/c/projects/ITM/boards/4/backlog)
- **Documentation**: [
  _Confluence_](https://project-william.atlassian.net/wiki/spaces/ITM/pages/16679168/Model+Product+Requirements)

## ♾️ Utils

- In the project directory, you can test API endpoints with [Bruno](https://www.usebruno.com/), after installing it and
  targeting the directory where you cloned the project,
  _**you will have access to the various endpoints preconfigured on the correct urls and ports, as well as the body,
  params, etc.**_
