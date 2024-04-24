import { cva, cx } from "class-variance-authority"
import React, { forwardRef } from "react"

import { montserrat, poppins } from "../lib/fonts"

type TextType = "title" | "heading" | "subheading" | "body" | "medium" | "small"
type TextVariant =
  | "accent"
  | "neutral"
  | "success"
  | "error"
  | "transparent"
  | "none"

type Props = React.HTMLAttributes<HTMLParagraphElement> & {
  type: TextType
  variant: TextVariant
}

const text = cva("", {
  variants: {
    variant: {
      accent: "text-accent-500",
      neutral: "text-neutral-500",
      success: "text-success-primary",
      error: "text-error-primary",
      transparent: "",
      none: "",
    },
    type: {
      title: `text-title ${montserrat.className}`,
      heading: `text-heading ${montserrat.className}`,
      subheading: `text-subheading ${montserrat.className}`,
      body: `text-body ${poppins.className}`,
      medium: `text-medium ${poppins.className}`,
      small: `text-small ${poppins.className}`,
    },
  },
})

const Text = forwardRef<HTMLParagraphElement, Props>((props, ref) => {
  const { className, type, variant, children } = props

  return (
    <p
      role="Text"
      ref={ref}
      className={cx(text({ variant, type, className }))}
      style={{ color: variant === "transparent" ? "transparent" : undefined }}
    >
      {children}
    </p>
  )
})
Text.displayName = "Text"

export { Text }
