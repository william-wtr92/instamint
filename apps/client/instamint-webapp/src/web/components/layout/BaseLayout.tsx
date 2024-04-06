import React from "react"
import Navbar from "./Navbar"
import Header from "./Header"

type Props = {
  children: React.ReactNode
}

const BaseLayout = (props: Props) => {
  const { children } = props

  return (
    <div
      className={
        "xs:flex-row flex h-screen w-screen flex-col-reverse duration-300"
      }
    >
      <Navbar />

      <main className="flex-1 border-red-500">{children}</main>

      <Header />
    </div>
  )
}

export default BaseLayout
