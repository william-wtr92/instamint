import { poppins } from "@instamint/ui-kit"
import { useRouter } from "next/router"
import React, { useCallback } from "react"

import AccountSettingsNavbar from "@/web/components/layout/AccountSettingsNavbar"
import Navbar from "@/web/components/layout/Navbar"
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

      <main
        className={`xs:block xs:order-3 flex-1 overflow-scroll ${hideComponentStyle()}`}
      >
        {children}
      </main>

      <AccountSettingsNavbar />
    </div>
  )
}

export default SettingsLayout
