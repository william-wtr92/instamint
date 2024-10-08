import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@instamint/ui-kit"
import { cx } from "class-variance-authority"
import { useTranslation } from "next-i18next"

type Props<T> = {
  open: boolean
  onClose: () => void
  onConfirm: (values?: T) => void
  titleKey: string
  descriptionKey: string
  cancelKey: string
  confirmKey: string
  type?: "danger" | "warning" | "informative"
}

export const AlertPopup = <T,>({
  open,
  onClose,
  onConfirm,
  titleKey,
  descriptionKey,
  cancelKey,
  confirmKey,
  type = "informative",
}: Props<T>) => {
  const { t } = useTranslation()

  const buttonVariants = {
    danger: "bg-danger-primary text-white font-semibold outline-0",
    warning: "bg-warning-primary text-white font-semibold outline-0",
    informative: "bg-accent-500 text-white font-semibold outline-0",
  }

  const buttonClass = cx("outline outline-black", buttonVariants[type])

  return (
    <AlertDialog open={open}>
      <AlertDialogContent className="bg-white">
        <AlertDialogHeader>
          <AlertDialogTitle>{t(titleKey)}</AlertDialogTitle>
          <AlertDialogDescription>{t(descriptionKey)}</AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter className="flex flex-row gap-2">
          <AlertDialogCancel
            onClick={onClose}
            className="outline outline-black"
          >
            {t(cancelKey)}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={() => onConfirm()}
            className={buttonClass}
          >
            {t(confirmKey)}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
