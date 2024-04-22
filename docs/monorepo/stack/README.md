# 🪛 Stack

Here is the technical stack used to carry out this project, with front end and back end technologies presented.

We use _**TypeScript**_ for the entire project, which is a superset of JavaScript that adds static types to the
language.

## 📦 Package Manager

- Pnpm: A fast, disk space efficient package manager, this will enable us to install and manage our dependencies more
  efficiently.

## 💻 Front End

We're using the following technologies for the user interface, and we're going to present the main technologies as well
as the important libraries used:

- **Next.js**: A React framework that enables features such as server-side rendering and static website generation for
  React-based web applications, this will enable us to build our application optimised for search engines and sharing on
  social media.

- **CSS**: We're going to use pure CSS so that we can structure our app more easily without having CSS in JS, which can
  sometimes be very complicated to manage as the application grows.

- **Zod**: A TypeScript-first schema declaration and validation library, this will enable us to validate the data we
  receive from the server and make sure it's in the right format.

- **SWR**: A React Hooks library for remote data fetching, this will enable us to fetch, cache and update data in our
  application.

- **Axios**: A promise-based HTTP client for the browser and Node.js, this will enable us to make requests to the
  server.

- **Jest**: A JavaScript test framework focused on simplicity, which will allow us to test our application and make sure
  it works as expected.

## 🔌 Back End

- **HonoJS**: It's a backend framework that lets you build web applications and APIs. It's very lightweight, so you can
  build your application quickly and efficiently. It offers us a wide range of third-party libraries directly
  implemented with the framework, and it's runtime agnostic, which gives us a fairly flexible environment.

- **PostgreSQL**: A powerful, open-source object-relational database system, this will enable us to store our data in a
  structured way.

- **Sentry**: A monitoring platform that helps us discover, triage, and prioritize errors in real-time, this will enable
  us to monitor our application and make sure it's working as expected.

- **Objection**: An SQL-friendly ORM for Node.js, which will allow us to interact with the database.

- **Knex**: A SQL query builder for PostgresSQL that works with Objection, designed to be flexible & portable.

- **Jest**: A JavaScript test framework focused on simplicity, which will allow us to test our application and make sure
  it works as expected.

- **Redis**: An open-source, in-memory data structure store, used as a database, cache, and message broker. This will
  enable
  us to store our data in memory and make our application faster.

## 🛜 Versioning

- **GitHub**: A code hosting platform for version control and collaboration, this will enable us to store our code and
  collaborate with other developers.

## 🐳 DevOps

- **Docker**: A set of platform as a service products that use OS-level virtualization to deliver software in packages
  called containers, this will enable us to build our application in a container and deploy it to the cloud.

- **Compose**: It' a tool for defining and running multi-container Docker applications, this will enable us to define
  our application in a single file and run it with a single command.

- **GitHub Actions**: A CI/CD tool that helps us automate our software development workflows, this will enable us to
  build, test and deploy our application automatically.

## 🔑 Security

- **GitHooks**: We use git hooks to execute actions at commit / push time and also on messages given in commits.

- **SonarQube**: A tool for continuous code quality inspection, this will enable us to analyze the code and identify
  security vulnerabilities during our CI (Continuous Integration) runs.

- **ESLint**: A tool to identify and report patterns found in the code, with the aim of making the code more consistent
  and avoiding bugs. This will enable us to have a uniform code that respects the following constraints

## 🌐 Hosting

- **Vercel**: For our NextJs front end, vVercel is a cloud platform that works in tandem with the technology we use,
  enabling us to deploy our application and make it available to the public.
