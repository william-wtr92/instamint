export type MailBuild<T> = {
  to: string
  from: string
  templateId: string
  dynamic_template_data: T
}

export type MailData = {
  username: string
  email: string
}
