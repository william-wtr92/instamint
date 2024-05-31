import type { ReadNotification } from "@instamint/shared-types"

import type { Services } from "@/types"
import { routes } from "@/web/routes"
import { handleApiErrors } from "@/web/utils/errors/handleApiErrors"

const readNotificationService: Services<ReadNotification, null> =
  ({ api }) =>
  async (data) => {
    try {
      const config = {
        withCredentials: true,
      }

      const { data: responseData } = await api.put(
        routes.api.users.notifications.readNotification({
          notificationId: data.notificationId,
        }),
        null,
        config
      )

      return [null, responseData]
    } catch (err) {
      return [handleApiErrors(err)]
    }
  }

export default readNotificationService
