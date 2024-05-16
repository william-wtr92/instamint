/* Cookies */
export const cookieNotSet = {
  errorCode: "cookieNotSet",
  message: "Cookie not set.",
} as const

/* Rooms */
export const roomNotFound = {
  errorCode: "roomNotFound",
  message: "Room not found.",
} as const

export const notRoomMember = {
  errorCode: "notRoomMember",
  message: "You are not a member of this room.",
} as const

export const roomProcessingError = {
  errorCode: "roomProcessingError",
  message: "Error processing room access.",
} as const
