import type { PrepareRoutes } from "@instamint/server-types"

import prepareSignUpRoutes from "@/routes/auth/prepareSignUpRoutes"
import prepareSignInRoutes from "@/routes/auth/prepareSignInRoutes"

const prepareRoutes: PrepareRoutes = (ctx) => {
  prepareSignUpRoutes(ctx)
  prepareSignInRoutes(ctx)
}

export default prepareRoutes
