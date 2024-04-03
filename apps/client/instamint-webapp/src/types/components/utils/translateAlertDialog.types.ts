export type TranslateAlertDialogProps = {
  open: boolean
  onClose: () => void
  onConfirm: () => void
  titleKey: string
  descriptionKey: string
  cancelKey: string
  confirmKey: string
  type?: "danger" | "warning" | "informative"
}
