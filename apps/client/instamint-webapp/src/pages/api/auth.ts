import { SC, genericErrorMessages } from "@instamint/server-types"
import axios from "axios"
import type { NextApiRequest, NextApiResponse } from "next"

import { config } from "@/web/config"
import { routes } from "@/web/routes"

const getApiBaseUrl = (): string => {
  if (process.env.DOCKER_ENV === "true") {
    return config.api.authUrl
  }

  return config.api.baseUrl
}

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const authToken = req.cookies["auth-token"]

  if (!authToken) {
    return res
      .status(SC.errors.NOT_FOUND)
      .json({ error: genericErrorMessages.NOT_FOUND })
  }

  try {
    const apiUrl = getApiBaseUrl()

    const response = await axios.get(`${apiUrl}${routes.api.auth.me}`, {
      headers: {
        Cookie: `auth-token=${authToken}`,
      },
      withCredentials: true,
    })

    return res.status(response.status).json(response.data)
  } catch (error) {
    return res
      .status(SC.serverErrors.INTERNAL_SERVER_ERROR)
      .json({ error: genericErrorMessages.INTERNAL_SERVER_ERROR })
  }
}

export default handler
