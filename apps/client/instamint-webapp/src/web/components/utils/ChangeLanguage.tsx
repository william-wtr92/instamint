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
import { useRouter } from "next/router"
import { useTranslation } from "next-i18next"
import { useCallback } from "react"

import useActionsContext from "@/web/contexts/useActionsContext"

export const ChangeLanguage = () => {
  const { language, changeLanguage } = useActionsContext()
  const { t } = useTranslation("navbar")

  const router = useRouter()

  const handleChangeLanguage = useCallback(
    async (newLanguage: string) => {
      await changeLanguage(newLanguage)

      router.push(router.asPath, router.asPath, { locale: newLanguage })
    },
    [router, changeLanguage]
  )

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="h-fit w-full border border-dotted focus-visible:ring-0"
        >
          🌍
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 backdrop-blur-[2px] ">
        <DropdownMenuLabel>{t("navbar:select-lang.label")}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup
          value={language}
          onValueChange={handleChangeLanguage}
        >
          <DropdownMenuRadioItem value="en">
            {t("navbar:select-lang.options.en")}
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="fr">
            {t("navbar:select-lang.options.fr")}
          </DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
