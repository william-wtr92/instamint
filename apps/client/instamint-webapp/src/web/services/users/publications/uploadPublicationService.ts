import type { AddPublication } from "@instamint/shared-types"

import type { Services } from "@/types"
import { routes } from "@/web/routes"
import { handleApiErrors } from "@/web/utils/errors/handleApiErrors"

const uploadPublicationService: Services<AddPublication, null> =
  ({ api }) =>
  async (data) => {
    try {
      const formData = new FormData()

      formData.append("image", data.image, data.image.name)
      formData.append("description", data?.description)

      if (data.location) {
        formData.append("location", data.location)
      }

      formData.append("hashtags", JSON.stringify(data.hashtags))

      const config = {
        withCredentials: true,
      }

      const { data: responseData } = await api.post(
        routes.api.users.publications.uploadPublication,
        formData,
        config
      )

      return [null, responseData]
    } catch (err) {
      return [handleApiErrors(err)]
    }
  }

export default uploadPublicationService
