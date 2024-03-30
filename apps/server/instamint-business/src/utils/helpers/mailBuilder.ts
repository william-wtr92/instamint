import sgMail from "@sendgrid/mail"

import appConfig from "@/db/config/config"
import { oneHour } from "@/utils/helpers/times"
import type { MailBuild, MailData } from "@/types"
import { signJwt } from "@/utils/helpers/jwtActions"

export const mailBuilder = async (data: MailData, expiration?: number) => {
  const mailToken = await signJwt(
    {
      user: {
        email: data.email,
      },
    },
    expiration ? expiration : oneHour
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
