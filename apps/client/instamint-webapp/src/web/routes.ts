import type {
  UserIdAdminAction,
  AdminUsersAll,
  Profile,
  GetMessages,
  GetPublications,
  GetNotifications,
  ReadNotification,
  GetPublicationParam,
  GetPublicationsParam,
  PublicationsLikesParam,
  AddCommentParam,
  DeleteCommentParam,
  ReplyCommentParam,
  Search,
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
      getPublication: (param: GetPublicationParam) =>
        `/users/publication/${param.publicationId}`,
      getPublications: (
        param: GetPublicationsParam,
        queries: GetPublications
      ) =>
        `/users/publications/${param.username}?limit=${queries.limit}&offset=${queries.offset}`,
      like: (param: PublicationsLikesParam) =>
        `/users/publications/${param.publicationId}/like`,
      comment: (param: AddCommentParam) =>
        `/users/publications/${param.publicationId}/comment`,
      deleteComment: (param: DeleteCommentParam) =>
        `/users/publications/${param.publicationId}/comment/${param.commentId}`,
      replyComment: (param: ReplyCommentParam) =>
        `/users/publications/${param.publicationId}/comment/${param.commentId}`,
    },
    modifyPassword: "/users/modify-password",
    modifyEmail: "/users/modify-email",
    uploadAvatar: "/users/upload-avatar",
    visibility: "/users/visibility",
    searchByEmail: "/users/search-by-email",
    profile: {
      getProfile: (queries: Profile) => `/profile/${queries.username}`,
      follow: (queries: Profile) => `/profile/${queries.username}/follow`,
      unfollow: (queries: Profile) => `/profile/${queries.username}/unfollow`,
      followRequest: "/profile/follow/request",
      deleteRequest: (queries: Profile) =>
        `/profile/${queries.username}/follow/request`,
      getFollowRequests: "/profile/follow/requests",
    },
    notifications: {
      getNotifications: (queries: Omit<GetNotifications, "limit">) =>
        `/users/notifications?limit=10&offset=${queries.offset}`,
      readNotification: (params: ReadNotification) =>
        `/users/notifications/${params.notificationId}/read`,
    },
  },
  search: {
    get: (queries: Omit<Search, "limit">) =>
      `/search?query=${queries.query}&limit=10&offset=${queries.offset}`,
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
