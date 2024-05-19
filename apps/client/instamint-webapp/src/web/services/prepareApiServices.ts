import type { PrepareServicesContext } from "@/types"
import deactivateAccountAdminService from "@/web/services/admin/users/deactivateAccountService"
import reactivateAccountAdminService from "@/web/services/admin/users/reactivateAccountService"
import emailValidationService from "@/web/services/auth/emailValidationService"
import resendEmailValidationService from "@/web/services/auth/resendEmailValidationService"
import signInService from "@/web/services/auth/signInService"
import signOutService from "@/web/services/auth/signOutService"
import signUpService from "@/web/services/auth/signUpService"
import deleteAccountService from "@/web/services/users/account/deleteAccountService"
import modifyEmailService from "@/web/services/users/account/modifyEmailService"
import modifyPasswordService from "@/web/services/users/account/modifyPasswordService"
import reactivateAccountService from "@/web/services/users/account/reactivateAccountService"
import updateUserInfosService from "@/web/services/users/account/updateUserInfosService"
import uploadAvatarService from "@/web/services/users/account/uploadAvatarService"
import confirmResetPasswordService from "@/web/services/users/reset/confirmResetPasswordService"
import requestResetPasswordService from "@/web/services/users/reset/requestResetPasswordService"

export const prepareApiServices: PrepareServicesContext = (context) => {
  return {
    services: {
      auth: {
        signUp: signUpService(context),
        emailValidation: emailValidationService(context),
        resendEmailValidation: resendEmailValidationService(context),
        signIn: signInService(context),
        signOut: signOutService(context),
      },
      users: {
        requestResetPassword: requestResetPasswordService(context),
        confirmResetPassword: confirmResetPasswordService(context),
        updateUserInfos: updateUserInfosService(context),
        deleteAccount: deleteAccountService(context),
        reactivateAccount: reactivateAccountService(context),
        modifyPassword: modifyPasswordService(context),
        modifyEmail: modifyEmailService(context),
        uploadAvatar: uploadAvatarService(context),
      },
      admin: {
        deactivateAccount: deactivateAccountAdminService(context),
        reactivateAccount: reactivateAccountAdminService(context),
      },
    },
  }
}
