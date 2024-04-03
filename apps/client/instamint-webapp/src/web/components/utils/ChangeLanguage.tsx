import { useRouter } from "next/router"
import { useCallback } from "react"
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@instamint/ui-kit"
import { useTranslation } from "next-i18next"

import useActionsContext from "@/web/contexts/useActionsContext"

export const ChangeLanguage = () => {
  const { language, changeLanguage } = useActionsContext()
  const { t } = useTranslation("common")

  const router = useRouter()

  const handleChangeLanguage = useCallback(
    async (newLanguage: string) => {
      await changeLanguage(newLanguage)

      await router.push(router.asPath, router.asPath, { locale: newLanguage })
    },
    [router, changeLanguage]
  )

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="size-10/12 border-0 outline-dotted outline-2 outline-offset-4 outline-neutral-800 focus-visible:outline-dotted focus-visible:outline-offset-4 focus-visible:ring-0"
        >
          🌍
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>{t("select-lang.label")}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup
          value={language}
          onValueChange={handleChangeLanguage}
        >
          <DropdownMenuRadioItem value="en">
            {t("select-lang.options.en")}
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="fr">
            {t("select-lang.options.fr")}
          </DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
