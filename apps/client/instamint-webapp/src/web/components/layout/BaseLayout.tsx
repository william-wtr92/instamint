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
      className={`xs:flex-row flex h-screen w-screen flex-col-reverse overflow-hidden duration-300 ${poppins.className}`}
    >
      <Navbar />

      <main className="no-scrollbar flex-1 overflow-scroll">{children}</main>

      <Header />
    </div>
  )
}

export default BaseLayout
