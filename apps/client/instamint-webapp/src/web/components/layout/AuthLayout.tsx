import React, { type ReactNode } from "react"

type Props = {
  children: ReactNode
}

const AuthLayout = (props: Props) => {
  const { children } = props

  return <div>{children}</div>
}

export default AuthLayout
