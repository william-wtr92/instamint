import { poppins } from "@instamint/ui-kit"
import React from "react"

import Header from "./Header"
import Navbar from "./Navbar"

type Props = {
  children: React.ReactNode
}

const BaseLayout = (props: Props) => {
  const { children } = props

  return (
    <div
      className={`xs:flex-row flex h-screen w-screen flex-col-reverse duration-300 ${poppins.className}`}
    >
      <Navbar />

      <main className="flex-1">{children}</main>

      <Header />
    </div>
  )
}

export default BaseLayout
