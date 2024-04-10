import type { PrepareRoutes } from "@instamint/server-types"

import prepareSignUpRoutes from "@/routes/auth/prepareSignUpRoutes"
import prepareSignInRoutes from "@/routes/auth/prepareSignInRoutes"
import prepareSignOutRoutes from "@/routes/auth/prepareSignOutRoutes"

import prepareResetRoutes from "@/routes/users/prepareResetRoutes"
import prepareUpdateFieldsRoutes from "@/routes/users/settings/prepareUpdateFieldsRoutes"
import prepareDeleteAccountRoutes from "@/routes/users/settings/prepareDeleteAccountRoutes"

const prepareRoutes: PrepareRoutes = (ctx) => {
  prepareSignUpRoutes(ctx)
  prepareSignInRoutes(ctx)
  prepareSignOutRoutes(ctx)

  prepareResetRoutes(ctx)
  prepareUpdateFieldsRoutes(ctx)
  prepareDeleteAccountRoutes(ctx)
}

export default prepareRoutes
