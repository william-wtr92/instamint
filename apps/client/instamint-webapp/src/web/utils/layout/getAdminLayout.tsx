import type { ReactElement } from "react"

import AdminLayout from "@/web/components/layout/AdminLayout"

const getAdminLayout = (page: ReactElement): ReactElement => {
  return <AdminLayout>{page}</AdminLayout>
}

export default getAdminLayout
