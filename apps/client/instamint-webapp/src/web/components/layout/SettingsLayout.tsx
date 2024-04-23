import { poppins } from "@instamint/ui-kit"
import { useRouter } from "next/router"
import React, { useCallback } from "react"

import AccountSettingsNavbar from "./AccountSettingsNavbar"
import Navbar from "./Navbar"
import { routes } from "@/web/routes"

type Props = {
  children: React.ReactNode
}

const SettingsLayout = (props: Props) => {
  const { children } = props
  const router = useRouter()

  const hideComponentStyle = useCallback(() => {
    const currentPath = router.pathname

    const routesComponentHasToBeHidden = [routes.client.profile.settings.base]

    return routesComponentHasToBeHidden.includes(currentPath)
      ? "hidden"
      : "block"
  }, [router])

  return (
    <div
      className={`flex h-screen w-screen flex-col-reverse ${poppins.className} xs:flex-row`}
    >
      <Navbar />

      <main className={`xs:block xs:order-3 flex-1 ${hideComponentStyle()}`}>
        {children}
      </main>

      <AccountSettingsNavbar />
    </div>
  )
}

export default SettingsLayout
