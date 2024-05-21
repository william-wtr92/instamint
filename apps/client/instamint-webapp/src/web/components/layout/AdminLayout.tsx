import { poppins } from "@instamint/ui-kit"
import React from "react"

import Header from "@/web/components/layout/Header"

type Props = {
  children: React.ReactNode
}

const AdminLayout = (props: Props) => {
  const { children } = props

  return (
    <div
      className={`xs:flex-row flex h-screen w-screen flex-col-reverse duration-300 ${poppins.className}`}
    >
      <main className="flex-1 border-red-500">{children}</main>

      <Header />
    </div>
  )
}

export default AdminLayout
