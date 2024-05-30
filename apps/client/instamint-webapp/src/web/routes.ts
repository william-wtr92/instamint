import type {
  UserIdAdminAction,
  AdminUsersAll,
  Profile,
  GetMessages,
  GetPublications,
} from "@instamint/shared-types"

import { defineRoutes } from "@/types"

const clientRoutes = {
  home: "/",
  signUp: "/sign-up",
  signIn: "/sign-in",
  auth: {
    email: {
      confirmation: "/auth/email",
      resend: "/auth/email/resend",
    },
  },
  profile: {
    getProfile: (link: string) => `/profile/${link}`,
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
  admin: {
    users: "/admin/users",
  },
  messages: (roomName: string) => `/messages/${roomName}`,
  about: "/about",
}

const apiRoutes = {
  admin: {
    users: {
      all: (queries: AdminUsersAll) =>
        `/admin/users?limit=${queries?.limit}&offset=${queries?.offset}&filter=${queries?.filter}`,
      deactivate: (params: UserIdAdminAction) =>
        `/admin/users/${params.id}/deactivate`,
      reactivate: (params: UserIdAdminAction) =>
        `/admin/users/${params.id}/reactivate`,
      delete: (params: UserIdAdminAction) => `/admin/users/${params.id}/delete`,
    },
  },
  auth: {
    internal: {
      authenticate: "/api/auth",
    },
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
    publications: {
      uploadPublication: "/users/upload-publication",
      getPublication: (publicationId: string) =>
        `/users/publication/${publicationId}`,
      getPublications: (username: string, queries: GetPublications) =>
        `/users/publications/${username}?limit=${queries.limit}&offset=${queries.offset}`,
      like: (publicationId: string) =>
        `/users/publications/${publicationId}/like`,
      comment: (publicationId: string) =>
        `/users/publications/${publicationId}/comment`,
      deleteComment: (publicationId: string, commentId: string) =>
        `/users/publications/${publicationId}/comment/${commentId}`,
      replyComment: (publicationId: string, commentId: string) =>
        `/users/publications/${publicationId}/comment/${commentId}`,
    },
    modifyPassword: "/users/modify-password",
    modifyEmail: "/users/modify-email",
    uploadAvatar: "/users/upload-avatar",
    profile: {
      getProfile: (queries: Profile) => `/profile/${queries.username}`,
    },
  },
  messages: {
    getMessages: (queries: Omit<GetMessages, "limit">) =>
      `/messages?roomName=${encodeURIComponent(queries.roomName)}&limit=20&offset=${queries.offset}`,
  },
} as const

export const routes = defineRoutes({
  client: clientRoutes,
  api: apiRoutes,
})
