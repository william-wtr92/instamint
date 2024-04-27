import type { PrepareRoutes } from "@instamint/server-types"

import prepareAzureRoutes from "@/routes/prepareAzureRoutes"

const prepareRoutes: PrepareRoutes = (ctx) => {
  prepareAzureRoutes(ctx)
}

export default prepareRoutes
