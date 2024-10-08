import type {
  ConfirmResetPassword,
  RequestResetPassword,
  UserInfos,
  DeleteAccount,
  ReactivateAccount,
  TwoFactorGenerateResult,
  ActivateTwoFactorAuthResult,
  TwoFactorAuthenticate,
  ModifyPassword,
  ModifyEmail,
  UserAvatar,
  AddPublication,
  Visibility,
  ReadNotification,
  PublicationsLikesParam,
  AddComment,
  AddCommentParam,
  DeleteCommentParam,
  ReplyComment,
  ReplyCommentParam,
  SearchByEmail,
  LikeCommentParam,
} from "@instamint/shared-types"

export type UsersServices = {
  requestResetPassword: [RequestResetPassword, null]
  confirmResetPassword: [ConfirmResetPassword, null]
  updateUserInfos: [UserInfos, null]
  deleteAccount: [DeleteAccount, null]
  reactivateAccount: [ReactivateAccount, null]
  twoFactorCodeGeneration: [null, TwoFactorGenerateResult]
  twoFactorActivation: [string, ActivateTwoFactorAuthResult]
  twoFactorAuthentication: [TwoFactorAuthenticate, null]
  twoFactorDeactivation: [string, null]
  modifyPassword: [ModifyPassword, null]
  modifyEmail: [ModifyEmail, null]
  uploadAvatar: [UserAvatar, null]
  uploadPublication: [AddPublication, null]
  visibility: [Visibility, null]
  searchByEmail: [SearchByEmail, null]
  readNotification: [ReadNotification, null]
  likePublicationService: [PublicationsLikesParam, null]
  addPublicationCommentService: [AddComment & AddCommentParam, null]
  deletePublicationCommentService: [DeleteCommentParam, null]
  replyPublicationCommentService: [ReplyComment & ReplyCommentParam, null]
  likePublicationCommentService: [LikeCommentParam, null]
}
