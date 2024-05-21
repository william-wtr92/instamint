import React, { type ReactElement } from "react"

import BaseLayout from "@/web/components/layout/BaseLayout"

const getBaseLayout = (page: ReactElement) => {
  return <BaseLayout>{page}</BaseLayout>
}

export default getBaseLayout
