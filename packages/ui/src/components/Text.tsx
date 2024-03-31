import React, { forwardRef } from "react"
import { cva, cx } from "class-variance-authority"

type TextType = "title" | "heading" | "subheading" | "body" | "medium" | "small"
type TextVariant = "accent" | "neutral" | "success" | "error"

type Props = React.HTMLAttributes<HTMLParagraphElement> & {
  type: TextType
  variant: TextVariant
}

const text = cva(
  "",
  {
    variants: {
      variant: {
        accent: "text-accent-500	",
        neutral: "text-neutral-500",
        success: "text-success-primary",
        error: "text-error-primary"
      },
      type: {
        title: "text-title",
        heading: "text-heading",
        subheading: "text-subheading",
        body: "text-body",
        medium: "text-medium",
        small: "text-small",
      },
    }
  }
)

const Text = forwardRef<HTMLParagraphElement, Props>((props, ref) => {
  const { className, type, variant, children } = props

  return (
    <p
      role="Text"
      ref={ref}
      className={cx(
        text({ variant, type, className }),
      )}
    >
      {children}
    </p>
  )
})
Text.displayName = "Text"

export { Text }