import sgMail from "@sendgrid/mail"

import appConfig from "@/db/config/config"
import type { DynamicData, MailBuild, MailData } from "@/types"
import { signJwt } from "@/utils/helpers/actions/jwtActions"
import { oneHour } from "@/utils/helpers/times"

export const mailBuilder = async <T extends MailData>(
  data: T,
  templateId: string,
  expiration?: number,
  withToken?: boolean
) => {
  const dynamicData: T & DynamicData = {
    ...data,
    baseUrl: appConfig.sendgrid.baseUrl,
  }

  if (withToken) {
    dynamicData.token = await signJwt(
      {
        user: {
          email: data.email,
        },
      },
      expiration ? expiration : oneHour
    )
  }

  sgMail.setApiKey(appConfig.sendgrid.apiKey)

  const sendGridMail: MailBuild<T> = {
    to: data.email,
    from: appConfig.sendgrid.sender,
    templateId: templateId,
    dynamic_template_data: dynamicData,
  }

  return sendGridMail
}
