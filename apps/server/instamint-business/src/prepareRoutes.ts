import type { PrepareRoutes } from "@instamint/server-types"

import prepareAdminUsersActionsRoutes from "@/routes/admin/users/prepareAdminUsersActionsRoutes"
import prepareAdminUsersRoutes from "@/routes/admin/users/prepareAdminUsersRoutes"
import prepareSignInRoutes from "@/routes/auth/prepareSignInRoutes"
import prepareSignOutRoutes from "@/routes/auth/prepareSignOutRoutes"
import prepareSignUpRoutes from "@/routes/auth/prepareSignUpRoutes"
import prepareTwoFactorAuthRoutes from "@/routes/auth/prepareTwoFactorAuthRoutes"
import prepareMessagesRoutes from "@/routes/messages/prepareMessagesRoutes"
import prepareNotificationsRoutes from "@/routes/users/notifications/prepareNotificationsRoutes"
import prepareResetRoutes from "@/routes/users/prepareResetRoutes"
import prepareFollowsRoutes from "@/routes/users/profile/prepareFollowsRoutes"
import prepareProfileRoutes from "@/routes/users/profile/prepareProfileRoutes"
import preparePublicationsRoutes from "@/routes/users/publications/preparePublicationsRoutes"
import prepareUploadPublicationRoutes from "@/routes/users/publications/prepareUploadPublication"
import prepareDeleteAccountRoutes from "@/routes/users/settings/prepareDeleteAccountRoutes"
import prepareModifyEmailRoutes from "@/routes/users/settings/prepareModifyEmailRoutes"
import prepareModifyPasswordRoutes from "@/routes/users/settings/prepareModifyPasswordRoutes"
import prepareUpdateUserInfosRoutes from "@/routes/users/settings/prepareUpdateUserInfosRoutes"
import prepareUploadAvatarRoutes from "@/routes/users/settings/prepareUploadAvatarRoutes"
import prepareVisibilityAccountRoutes from "@/routes/users/settings/prepareVisibilityAccountRoutes"

const prepareRoutes: PrepareRoutes = (ctx) => {
  prepareSignUpRoutes(ctx)
  prepareSignInRoutes(ctx)
  prepareSignOutRoutes(ctx)

  prepareResetRoutes(ctx)
  prepareUpdateUserInfosRoutes(ctx)
  prepareDeleteAccountRoutes(ctx)
  prepareModifyPasswordRoutes(ctx)
  prepareModifyEmailRoutes(ctx)
  prepareUploadAvatarRoutes(ctx)
  prepareTwoFactorAuthRoutes(ctx)
  prepareVisibilityAccountRoutes(ctx)
  prepareProfileRoutes(ctx)

  prepareFollowsRoutes(ctx)
  prepareMessagesRoutes(ctx)
  prepareUploadPublicationRoutes(ctx)
  preparePublicationsRoutes(ctx)

  prepareNotificationsRoutes(ctx)

  prepareAdminUsersRoutes(ctx)
  prepareAdminUsersActionsRoutes(ctx)
}

export default prepareRoutes
