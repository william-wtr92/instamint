import type { SearchByEmail } from "@instamint/shared-types"

import type { Services } from "@/types"
import { routes } from "@/web/routes"
import { handleApiErrors } from "@/web/utils/errors/handleApiErrors"

const updateSearchByEmailService: Services<SearchByEmail, null> =
  ({ api }) =>
  async (data) => {
    try {
      const body = {
        searchByEmail: data.searchByEmail,
      }

      const config = {
        withCredentials: true,
      }

      const { data: responseData } = await api.put(
        routes.api.users.searchByEmail,
        body,
        config
      )

      return [null, responseData]
    } catch (err) {
      return [handleApiErrors(err)]
    }
  }

export default updateSearchByEmailService
