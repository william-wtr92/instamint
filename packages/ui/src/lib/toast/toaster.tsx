import {
  CheckBadgeIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
} from "@heroicons/react/24/outline"

import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "../../.."
import { useToast } from "./useToast"

export const Toaster = () => {
  const { toasts } = useToast()

  return (
    <ToastProvider>
      {toasts.map(function ({ id, title, description, action, ...props }) {
        return (
          <Toast key={id} {...props}>
            {props.variant === "default" && (
              <InformationCircleIcon className="h-8 w-8" />
            )}
            {props.variant === "success" && (
              <CheckBadgeIcon className="h-8 w-8" />
            )}
            {props.variant === "error" && (
              <ExclamationTriangleIcon className="h-8 w-8" />
            )}

            <div className="grid w-[90%] gap-1">
              {title && <ToastTitle>{title}</ToastTitle>}
              {description && (
                <ToastDescription>{description}</ToastDescription>
              )}
            </div>
            {action}
            <ToastClose />
          </Toast>
        )
      })}
      <ToastViewport />
    </ToastProvider>
  )
}
