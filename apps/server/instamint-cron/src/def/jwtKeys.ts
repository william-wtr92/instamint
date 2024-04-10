import config from "@/config"

export const jwtKeys = {
  cron: {
    deleteAccount: {
      jobId: "delete-account",
      scope: config.jwt.scopes.deleteAccount,
    },
  },
} as const
