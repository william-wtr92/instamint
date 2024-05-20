import type { PrepareRoutes } from "@instamint/server-types"

import prepareTwoFactorAuthRoutes from "./routes/auth/prepareTwoFactorAuthRoutes"

import prepareSignInRoutes from "@/routes/auth/prepareSignInRoutes"
import prepareSignOutRoutes from "@/routes/auth/prepareSignOutRoutes"
import prepareSignUpRoutes from "@/routes/auth/prepareSignUpRoutes"
import prepareMessagesRoutes from "@/routes/messages/prepareMessagesRoutes"
import prepareCreateTeaBagsRoutes from "@/routes/teaBags/prepareCreateTeaBagsRoutes"
import prepareResetRoutes from "@/routes/users/prepareResetRoutes"
import prepareProfileRoutes from "@/routes/users/profile/prepareProfileRoutes"
import prepareDeleteAccountRoutes from "@/routes/users/settings/prepareDeleteAccountRoutes"
import prepareModifyEmailRoutes from "@/routes/users/settings/prepareModifyEmailRoutes"
import prepareModifyPasswordRoutes from "@/routes/users/settings/prepareModifyPasswordRoutes"
import prepareUpdateUserInfosRoutes from "@/routes/users/settings/prepareUpdateUserInfosRoutes"
import prepareUploadAvatarRoutes from "@/routes/users/settings/prepareUploadAvatarRoutes"

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
  prepareProfileRoutes(ctx)
  prepareMessagesRoutes(ctx)

  prepareCreateTeaBagsRoutes(ctx)
}

export default prepareRoutes
