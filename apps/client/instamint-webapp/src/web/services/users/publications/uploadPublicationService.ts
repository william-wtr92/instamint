import type { UploadPublication } from "@instamint/shared-types"

import type { Services } from "@/types"
import { routes } from "@/web/routes"
import { handleApiErrors } from "@/web/utils/errors/handleApiErrors"

const uploadPublicationService: Services<UploadPublication, null> =
  ({ api }) =>
  async (data) => {
    try {
      const formData = new FormData()

      if (data?.image) {
        formData.append("image", data.image, data.image.name)
      }

      if (data?.description) {
        formData.append("description", data?.description)
      }

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
