import { sign } from "hono/jwt"
import sgMail from "@sendgrid/mail"

import appConfig from "@/db/config/config"
import { now, oneHour } from "@/utils/helpers/times"
import type { MailBuild, MailData } from "@/types"

export const mailBuilder = async (data: MailData, expiration?: number) => {
  const mailToken = await sign(
    {
      payload: {
        user: {
          email: data.email,
        },
      },
      exp: expiration ? expiration : oneHour,
      nbf: now,
      iat: now,
    },
    appConfig.security.jwt.secret,
    appConfig.security.jwt.algorithm
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
