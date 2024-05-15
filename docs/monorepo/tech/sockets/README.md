# 🔗 Websockets

> Websockets are a communication protocol that provides full-duplex communication channels over a single TCP connection.
> It is used in web applications to provide real-time communication between a client and a server.

# 📚 Resources

- [📝 Websockets Documentation](https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API)
- [📦 Package: Socket.io](https://github.com/socketio/socket.io)
- [📦 Package: Socket.io-client](https://github.com/socketio/socket.io-client)
- [📖 Socket.io with TypeScript](https://socket.io/docs/v4/typescript/)

## 💡 How to use Redis in HonoJS

### ⚠️ Requirements

- Backend: Install `socket.io` dependencies using `pnpm` or `npm`.

```bash
pnpm add socket.io
```

- Frontend: Install `socket.io-client` dependencies using `pnpm` or `npm`.

```bash
pnpm add socket.io-client
```

### ⚙️ Steps

#### 💾 Server Side

- Custom your `index.ts` file to use Socket.io.

```ts
import { serve } from "@hono/node-server"
import type { Server as HTTPServer } from "node:http"

import { initWs } from "@/sockets"

server(appConfig).then((app) => {
  const serv = serve({
    fetch: app.fetch,
    port: appConfig.port,
  })

  initWs(serv as HTTPServer) // Initialize Socket.io, watch code below
})
```

- Create a new file `sockets/index.ts` and add the following code:

```ts
import { events } from "@instamint/shared-types"
import type { Server as HTTPSServer } from "node:http"

export const initWs = (server: HTTPSServer) => {
  const io = setupWs(server) // Setup Socket.io, watch code below

  io.on("connection", (socket) => {
    // Handle socket events here
  })
}
```

- Create a new file `sockets/setup.ts` and add the following code:

```ts
import type { Server as HTTPSServer } from "node:http"
import { Server as SocketIOServer } from "socket.io"

export const setupWs = (server: HTTPSServer): SocketIOServer => {
  return new SocketIOServer(server, {
    cors: {
      origin: appConfig.security.cors.origin, // Add your origin here
      credentials: appConfig.security.cors.credentials, // To allow cookies
      methods: ["GET", "POST"], // Add more methods if needed
    },
  })
}
```

#### 💻 Client Side

- Create a new file `sockets/client.ts` and add the following code:

```ts
import { io, type Socket } from "socket.io-client"

export const createSocketClient = (): Socket => {
  return io("http://localhost:3001", {
    // Add your server URL here -> put it in your .env file
    withCredentials: true, // To allow cookies
  })
}
```

- Use the `createSocketClient` function to create a new socket connection in your client-side code.

```ts
import { createSocketClient } from "@/sockets/client"

const socket = createSocketClient()

socket.on("connect", () => {
  console.log("Connected to the server")
})
```
