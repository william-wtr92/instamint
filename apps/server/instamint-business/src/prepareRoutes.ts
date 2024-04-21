import type { PrepareRoutes } from "@instamint/server-types"

import prepareSignUpRoutes from "@/routes/auth/prepareSignUpRoutes"
import prepareSignInRoutes from "@/routes/auth/prepareSignInRoutes"
import prepareSignOutRoutes from "@/routes/auth/prepareSignOutRoutes"

import prepareResetRoutes from "@/routes/users/prepareResetRoutes"
import prepareUpdateUserInfosRoutes from "@/routes/users/settings/prepareUpdateUserInfosRoutes"
import prepareDeleteAccountRoutes from "@/routes/users/settings/prepareDeleteAccountRoutes"
import prepareModifyPasswordRoutes from "@/routes/users/settings/prepareModifyPasswordRoutes"

const prepareRoutes: PrepareRoutes = (ctx) => {
  prepareSignUpRoutes(ctx)
  prepareSignInRoutes(ctx)
  prepareSignOutRoutes(ctx)

  prepareResetRoutes(ctx)
  prepareUpdateUserInfosRoutes(ctx)
  prepareDeleteAccountRoutes(ctx)
  prepareModifyPasswordRoutes(ctx)
}

export default prepareRoutes
