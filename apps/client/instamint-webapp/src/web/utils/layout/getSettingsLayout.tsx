import type { ReactElement } from "react"

import SettingsLayout from "@/web/components/layout/SettingsLayout"

const getSettingsLayout = (page: ReactElement): ReactElement => {
  return <SettingsLayout>{page}</SettingsLayout>
}

export default getSettingsLayout
