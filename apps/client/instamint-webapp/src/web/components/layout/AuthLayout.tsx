import { poppins } from "@instamint/ui-kit"
import React, { type ReactNode } from "react"

type Props = {
  children: ReactNode
}

const AuthLayout = (props: Props) => {
  const { children } = props

  return <div className={`${poppins.className}`}>{children}</div>
}

export default AuthLayout
