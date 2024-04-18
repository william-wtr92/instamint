import React from "react"
import Navbar from "./Navbar"
import AccountSettingsNavbar from "./AccountSettingsNavbar"
import { poppins } from "@instamint/ui-kit"

type Props = {
  children: React.ReactNode
}

const SettingsLayout = (props: Props) => {
  const { children } = props

  return (
    <div
      className={`flex h-screen w-screen flex-col-reverse ${poppins.className} xs:flex-row`}
    >
      <Navbar />

      <main className="xs:block xs:order-3 hidden flex-1">{children}</main>

      <AccountSettingsNavbar />
    </div>
  )
}

export default SettingsLayout
