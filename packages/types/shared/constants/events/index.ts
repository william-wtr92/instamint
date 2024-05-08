export const events = {
  connection: "connection",
  error: "error",
  chat: {
    message: "chatMessage",
  },
  room: {
    join: "joinRoom",
    leave: "leaveRoom",
  },
} as const
