export type MailData = {
  email: string
}

export type DynamicData = {
  token?: string
}

export type MailBuild<T> = {
  to: string
  from: string
  templateId: string
  dynamic_template_data: T & DynamicData
}
