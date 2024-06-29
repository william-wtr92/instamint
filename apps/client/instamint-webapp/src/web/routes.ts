import { defineRoutes } from "@/types"

const clientRoutes = {
  home: "/",
  signUp: "/sign-up",
  signIn: "/sign-in",
  teabags: "/teabags",
  auth: {
    email: {
      confirmation: "/auth/email",
      resend: "/auth/email/resend",
    },
  },
  profile: {
    settings: {
      base: "/profile/settings",
      edit: "/profile/settings/edit",
      security: "/profile/settings/security",
      notifications: "/profile/settings/notifications",
    },
  },
  users: {
    resetPasswordRequest: "/users/reset-password",
    resetPasswordConfirm: "/users/reset-password/confirm",
  },
  messages: (roomName: string) => `/messages/${roomName}`,
  about: "/about",
}

const apiRoutes = {
  auth: {
    signUp: "/auth/sign-up",
    emailValidation: "/auth/email-validation",
    resendEmailValidation: "/auth/resend-email-validation",
    signIn: "/auth/sign-in",
    signIn2fa: "/auth/sign-in-2fa",
    signIn2faBackupCode: "/auth/sign-in-2fa-backup-code",
    signOut: "/auth/sign-out",
    me: "/auth/me",
  },
  users: {
    requestResetPassword: "/users/reset-password/request",
    confirmResetPassword: "/users/reset-password/confirm",
    updateUserInfos: "/users/update-account",
    deleteAccount: "/users/delete-account",
    reactivateAccount: "/users/reactivate-account",
    twoFactorAuth: {
      authenticate: "auth/2fa/authenticate",
      generate: "auth/2fa/generate",
      activate: "auth/2fa/activate",
      deactivate: "auth/2fa/deactivate",
    },
    modifyPassword: "/users/modify-password",
    modifyEmail: "/users/modify-email",
    uploadAvatar: "/users/upload-avatar",
    profile: {
      getProfile: (username: string) => `/profile/${username}`,
    },
  },
  messages: {
    getMessages: (roomName: string, offset: number) =>
      `/messages?roomName=${encodeURIComponent(roomName)}&limit=20&offset=${offset}`,
  },
  teaBags: {
    create: "/teabags/create",
  },
} as const

export const routes = defineRoutes({
  client: clientRoutes,
  api: apiRoutes,
})
