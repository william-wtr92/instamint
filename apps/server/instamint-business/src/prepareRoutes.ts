import prepareUserRoutes from "@/routes/prepareUserRoutes"
import { PrepareRoutes } from "@instamint/server-types"

const prepareRoutes: PrepareRoutes = (ctx): void => {
  prepareUserRoutes(ctx)
}

export default prepareRoutes
