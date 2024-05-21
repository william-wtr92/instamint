import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@instamint/ui-kit"
import { MoreHorizontal } from "lucide-react"

import type { User, UserActions } from "@/types"

type Props = {
  handleTriggerConfirmPopup: (
    userId: string,
    userEmail: string,
    userAction: UserActions
  ) => void
  user: User
  t: (key: string, values?: Record<string, string>) => string
}

export const DropdownAdminMenu = ({
  handleTriggerConfirmPopup,
  user,
  t,
}: Props) => {
  const deleted = user.deletionDate !== null

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
            disabled={deleted}
            className="hover:cursor-pointer"
            onClick={() =>
              handleTriggerConfirmPopup(user.id, user.email, "reactivate")
            }
          >
            {t("table.actions.reactivateAccount")}
          </DropdownMenuItem>
        )}
        <DropdownMenuItem
          disabled={deleted}
          className="hover:cursor-pointer"
          onClick={() =>
            handleTriggerConfirmPopup(user.id, user.email, "delete")
          }
        >
          {t("table.actions.deleteAccount")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
