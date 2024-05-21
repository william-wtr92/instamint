import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Button,
  Text,
} from "@instamint/ui-kit"
import type { ColumnDef } from "@tanstack/react-table"
import { MoreHorizontal } from "lucide-react"
import { useTranslation } from "next-i18next"

import type { User, UserActions } from "@/types"
import { useUser } from "@/web/hooks/auth/useUser"
import { formatDate } from "@/web/utils/helpers/dateHelper"
import { firstLetterUppercase } from "@/web/utils/helpers/stringHelper"

type UsersColumnsTable = {
  handleTriggerConfirmPopup: (
    userId: string,
    userEmail: string,
    userAction: UserActions
  ) => void
  t: (key: string, values?: Record<string, string>) => string
}

export const useTableColumns = ({
  handleTriggerConfirmPopup,
}: UsersColumnsTable) => {
  const { t } = useTranslation("admin-users")
  const { data: connectedUserData } = useUser()

  return [
    {
      accessorKey: "email",
      header: `${t("table.columns.email")}`,
      cell: ({ row }) => {
        const email = row.original.email

        return (
          <>
            {connectedUserData?.email === email ? (
              <Text type={"medium"} variant={"none"}>
                {t("table.cell.emailConnected", { email: email })}
              </Text>
            ) : (
              <Text type={"medium"} variant={"none"}>
                {t("table.cell.email", { email: email })}
              </Text>
            )}
          </>
        )
      },
    },
    {
      accessorKey: "username",
      header: `${t("table.columns.username")}`,
      cell: ({ row }) => {
        const username = row.original.username

        return (
          <Text type={"medium"} variant={"none"}>
            {username}
          </Text>
        )
      },
    },
    {
      accessorKey: "createdAt",
      header: `${t("table.columns.createAt")}`,
      cell: ({ row }) => {
        const createdAt = row.original.createdAt

        return (
          <Text type={"medium"} variant={"none"}>
            {formatDate(createdAt)}
          </Text>
        )
      },
    },
    {
      accessorKey: "roleData",
      header: `${t("table.columns.roleData")}`,
      cell: ({ row }) => {
        const role = row.original.roleData

        return (
          <Text type={"medium"} variant={"none"}>
            {firstLetterUppercase(role)}
          </Text>
        )
      },
    },
    {
      accessorKey: "active",
      header: `${t("table.columns.active")}`,
      cell: ({ row }) => {
        const active = row.original.active

        return (
          <>
            {active ? (
              <div className="ml-4">
                <div className="bg-accent-300 size-4 rounded-2xl" />
              </div>
            ) : (
              <div className="ml-4">
                <div className="bg-error-primary size-4 rounded-2xl opacity-70" />
              </div>
            )}
          </>
        )
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const user = row.original

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">{t("table.actions.trigger")}</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="bg-white">
              <DropdownMenuLabel>{t("table.actions.title")}</DropdownMenuLabel>
              <DropdownMenuItem
                className="hover:cursor-pointer"
                onClick={() => navigator.clipboard.writeText(user.email)}
              >
                {t("table.actions.copyEmail")}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              {user.active ? (
                <DropdownMenuItem
                  className="hover:cursor-pointer"
                  onClick={() =>
                    handleTriggerConfirmPopup(user.id, user.email, "deactivate")
                  }
                >
                  {t("table.actions.deactivateAccount")}
                </DropdownMenuItem>
              ) : (
                <DropdownMenuItem
                  className="hover:cursor-pointer"
                  onClick={() =>
                    handleTriggerConfirmPopup(user.id, user.email, "reactivate")
                  }
                >
                  {t("table.actions.reactivateAccount")}
                </DropdownMenuItem>
              )}
              <DropdownMenuItem className="hover:cursor-pointer">
                {t("table.actions.deleteAccount")}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ] as ColumnDef<User>[]
}
