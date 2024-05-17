import type { ReactElement } from "react"

import AuthLayout from "@/web/components/layout/AuthLayout"

const getAuthLayout = (page: ReactElement): ReactElement => {
  return <AuthLayout>{page}</AuthLayout>
}

export default getAuthLayout
