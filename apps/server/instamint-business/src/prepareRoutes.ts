import type { PrepareRoutes } from "@instamint/server-types"

import prepareUserRoutes from "@/routes/prepareUserRoutes"

const prepareRoutes: PrepareRoutes = (ctx) => {
  prepareUserRoutes(ctx)
}

export default prepareRoutes
