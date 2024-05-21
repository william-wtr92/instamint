import type { UserIdAdminAction } from "@instamint/shared-types"

export type AdminServices = {
  deactivateAccount: [UserIdAdminAction, null]
  reactivateAccount: [UserIdAdminAction, null]
}
