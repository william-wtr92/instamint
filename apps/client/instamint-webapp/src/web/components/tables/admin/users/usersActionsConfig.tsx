import type { UserIdAdminAction } from "@instamint/shared-types"

type AlertVariant = "danger" | "warning" | "informative"

type UsersActionsConfig = {
  handleDeactivateAccount: (values: UserIdAdminAction) => Promise<void>
  handleReactivateAccount: (values: UserIdAdminAction) => Promise<void>
  t: (key: string, values?: Record<string, string>) => string
}

export const usersActionsConfig = ({
  handleDeactivateAccount,
  handleReactivateAccount,
  t,
}: UsersActionsConfig) => {
  return {
    deactivate: {
      type: "danger" as AlertVariant,
      titleKey: (email: string) => t("cta.deactivateAccount.title", { email }),
      descriptionKey: t("cta.deactivateAccount.description"),
      cancelKey: t("cta.deactivateAccount.cancel"),
      confirmKey: t("cta.deactivateAccount.confirm"),
      handler: (values: UserIdAdminAction) => handleDeactivateAccount(values),
    },
    reactivate: {
      type: "informative" as AlertVariant,
      titleKey: (email: string) => t("cta.reactivateAccount.title", { email }),
      descriptionKey: t("cta.reactivateAccount.description"),
      cancelKey: t("cta.reactivateAccount.cancel"),
      confirmKey: t("cta.reactivateAccount.confirm"),
      handler: (values: UserIdAdminAction) => handleReactivateAccount(values),
    },
  }
}