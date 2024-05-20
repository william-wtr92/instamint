import type { PrepareServicesContext } from "@/types"
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
import uploadAvatarService from "@/web/services/users/account/uploadAvatarService"
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
      },
    },
  }
}
