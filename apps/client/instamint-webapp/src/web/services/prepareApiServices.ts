import type { PrepareServicesContext } from "@/types"
import deactivateAccountAdminService from "@/web/services/admin/users/deactivateAccountService"
import deleteAccountAdminService from "@/web/services/admin/users/deleteAccountService"
import reactivateAccountAdminService from "@/web/services/admin/users/reactivateAccountService"
import emailValidationService from "@/web/services/auth/emailValidationService"
import resendEmailValidationService from "@/web/services/auth/resendEmailValidationService"
import signIn2faBackupCodeService from "@/web/services/auth/signIn2faBackupCodeService"
import signIn2faService from "@/web/services/auth/signIn2faService"
import signInService from "@/web/services/auth/signInService"
import signOutService from "@/web/services/auth/signOutService"
import signUpService from "@/web/services/auth/signUpService"
import deleteAccountService from "@/web/services/users/account/deleteAccountService"
import modifyEmailService from "@/web/services/users/account/modifyEmailService"
import modifyPasswordService from "@/web/services/users/account/modifyPasswordService"
import reactivateAccountService from "@/web/services/users/account/reactivateAccountService"
import confirmResetPasswordService from "@/web/services/users/account/reset/confirmResetPasswordService"
import requestResetPasswordService from "@/web/services/users/account/reset/requestResetPasswordService"
import twoFactorActivationService from "@/web/services/users/account/twoFactorActivationService"
import twoFactorAuthenticationService from "@/web/services/users/account/twoFactorAuthenticationService"
import twoFactorCodeGenerationService from "@/web/services/users/account/twoFactorCodeGenerationService"
import twoFactorDeactivationService from "@/web/services/users/account/twoFactorDeactivationService"
import updateUserInfosService from "@/web/services/users/account/updateUserInfosService"
import updateVisibilityAccountService from "@/web/services/users/account/updateVisibilityAccountService"
import uploadAvatarService from "@/web/services/users/account/uploadAvatarService"
import deleteFollowRequestService from "@/web/services/users/profile/deleteFollowRequestService"
import followRequestService from "@/web/services/users/profile/followRequestService"
import followService from "@/web/services/users/profile/followService"
import unfollowService from "@/web/services/users/profile/unfollowService"
import addPublicationCommentService from "@/web/services/users/publications/addPublicationCommentService"
import deletePublicationCommentService from "@/web/services/users/publications/deletePublicationCommentService"
import likePublicationService from "@/web/services/users/publications/likePublicationService"
import replyPublicationCommentService from "@/web/services/users/publications/replyPublicationCommentService"
import uploadPublicationService from "@/web/services/users/publications/uploadPublicationService"

export const prepareApiServices: PrepareServicesContext = (context) => {
  return {
    services: {
      auth: {
        signUp: signUpService(context),
        emailValidation: emailValidationService(context),
        resendEmailValidation: resendEmailValidationService(context),
        signIn: signInService(context),
        signIn2fa: signIn2faService(context),
        signIn2faBackupCode: signIn2faBackupCodeService(context),
        signOut: signOutService(context),
      },
      users: {
        requestResetPassword: requestResetPasswordService(context),
        confirmResetPassword: confirmResetPasswordService(context),
        updateUserInfos: updateUserInfosService(context),
        deleteAccount: deleteAccountService(context),
        reactivateAccount: reactivateAccountService(context),
        twoFactorCodeGeneration: twoFactorCodeGenerationService(context),
        twoFactorActivation: twoFactorActivationService(context),
        twoFactorAuthentication: twoFactorAuthenticationService(context),
        twoFactorDeactivation: twoFactorDeactivationService(context),
        modifyPassword: modifyPasswordService(context),
        modifyEmail: modifyEmailService(context),
        uploadAvatar: uploadAvatarService(context),
        uploadPublication: uploadPublicationService(context),
        visibility: updateVisibilityAccountService(context),
        likePublicationService: likePublicationService(context),
        addPublicationCommentService: addPublicationCommentService(context),
        deletePublicationCommentService:
          deletePublicationCommentService(context),
        replyPublicationCommentService: replyPublicationCommentService(context),
      },
      profile: {
        follow: followService(context),
        unfollow: unfollowService(context),
        followRequest: followRequestService(context),
        deleteFollowRequest: deleteFollowRequestService(context),
      },
      admin: {
        deactivateAccount: deactivateAccountAdminService(context),
        reactivateAccount: reactivateAccountAdminService(context),
        deleteAccount: deleteAccountAdminService(context),
      },
    },
  }
}
