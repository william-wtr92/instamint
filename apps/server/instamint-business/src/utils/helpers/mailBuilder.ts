import { sign } from "hono/jwt"
import sgMail from "@sendgrid/mail"

import appConfig from "@/db/config/config"
import { now } from "@/utils/helpers/times"
import type { MailBuild, MailData } from "@/types"

export const mailBuilder = async (data: MailData) => {
  const mailToken = await sign(
    {
      payload: {
        user: {
          email: data.email,
        },
      },
      exp: appConfig.security.jwt.expiresIn,
      nbf: now,
      iat: now,
    },
    appConfig.security.jwt.secret,
    "HS512"
  )

  sgMail.setApiKey(appConfig.sendgrid.apiKey)

  const sendGridMail: MailBuild<{ username: string; token: string }> = {
    to: data.email,
    from: appConfig.sendgrid.sender,
    templateId: "d-66e0b9564a2b499e92a61c4a358f3e6c",
    dynamic_template_data: { username: data.username, token: mailToken },
  }

  return sendGridMail
}
