import React, { type ReactNode } from "react"

type Props = {
  children: ReactNode
}

const SettingsPageContainer = (props: Props) => {
  const { children } = props

  return (
    <div className="animate-slideInFromLeft z-10 mx-auto flex flex-col gap-6 overflow-y-scroll px-8 py-10 lg:px-14">
      {children}
    </div>
  )
}

export default SettingsPageContainer
