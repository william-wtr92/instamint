import type { UserIdAdminAction } from "@instamint/shared-types"
import { DataTable } from "@instamint/ui-kit"
import type { GetServerSideProps } from "next"
import { useTranslation } from "next-i18next"
import { serverSideTranslations } from "next-i18next/serverSideTranslations"
import React, { useCallback, useEffect, useState } from "react"

import type { UserActions } from "@/types"
import { useTableColumns } from "@/web/components/admin/tables/admin/users/tableColumns"
import { usersActionsConfig } from "@/web/components/admin/tables/admin/users/usersActionsConfig"
import { AlertPopup } from "@/web/components/utils/AlertPopup"
import useActionsContext from "@/web/contexts/useActionsContext"
import useAppContext from "@/web/contexts/useAppContext"
import { useUsers } from "@/web/hooks/admin/users/useUsers"
import { useUser } from "@/web/hooks/auth/useUser"
import { routes } from "@/web/routes"
import getTranslationBaseImports from "@/web/utils/helpers/getTranslationBaseImports"
import getAdminLayout from "@/web/utils/layout/getAdminLayout"

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { locale } = context

  return {
    props: {
      ...(await serverSideTranslations(locale ?? "en", [
        ...getTranslationBaseImports(),
        "admin-users",
      ])),
    },
  }
}

const DashboardPage = () => {
  const { t } = useTranslation("admin-users")

  const {
    services: {
      auth: { signOut },
      admin: { deactivateAccount, reactivateAccount, deleteAccount },
    },
  } = useAppContext()
  const { toast, redirect } = useActionsContext()
  const { data: connectedUserData } = useUser()

  const [pageSize, setPageSize] = useState<number>(10)
  const [pageIndex, setPageIndex] = useState<number>(0)
  const [filter, setFilter] = useState<string>("")
  const {
    data: usersData,
    pagination,
    mutate,
  } = useUsers({
    limit: pageSize.toString(),
    offset: (pageIndex * pageSize).toString(),
    filter: filter,
  })

  const [modalOpen, setModalOpen] = useState<boolean>(false)
  const [userId, setUserId] = useState<string | null>(null)
  const [userEmail, setUserEmail] = useState<string | null>(null)
  const [userAction, setUserAction] = useState<UserActions | null>(null)

  const handleTriggerConfirmPopup = useCallback(
    (userId: string, userEmail: string, userAction: UserActions) => {
      setUserId(userId)
      setUserEmail(userEmail)
      setModalOpen((prevState) => !prevState)
      setUserAction(userAction)
    },
    [setModalOpen]
  )

  const handleDeactivateAccount = useCallback(
    async (values: UserIdAdminAction) => {
      const [err] = await deactivateAccount(values)

      if (err) {
        toast({
          variant: "error",
          description: t(`errors:admin.users.${err.message}`),
        })

        return
      }

      setModalOpen(false)
      toast({
        variant: "success",
        description: t("success.deactivateAccount", { email: userEmail }),
      })

      await mutate()

      if (parseInt(userId!) === connectedUserData?.id) {
        await signOut(null)
        redirect(routes.client.signIn)
      }
    },
    [
      deactivateAccount,
      toast,
      mutate,
      redirect,
      setModalOpen,
      signOut,
      connectedUserData,
      userId,
      userEmail,
      t,
    ]
  )

  const handleReactivateAccount = useCallback(
    async (values: UserIdAdminAction) => {
      const [err] = await reactivateAccount(values)

      if (err) {
        toast({
          variant: "error",
          description: t(`errors:admin.users.${err.message}`),
        })

        return
      }

      setModalOpen(false)
      toast({
        variant: "success",
        description: t("success.reactivateAccount", { email: userEmail }),
      })

      await mutate()
    },
    [reactivateAccount, toast, mutate, setModalOpen, userEmail, t]
  )

  const handleDeleteAccount = useCallback(
    async (values: UserIdAdminAction) => {
      const [err] = await deleteAccount(values)

      if (err) {
        toast({
          variant: "error",
          description: t(`errors:admin.users.${err.message}`),
        })

        return
      }

      setModalOpen(false)
      toast({
        variant: "success",
        description: t("success.deleteAccount", { email: userEmail }),
      })

      await mutate()

      if (parseInt(userId!) === connectedUserData?.id) {
        await signOut(null)
        redirect(routes.client.signIn)
      }
    },
    [
      deleteAccount,
      toast,
      mutate,
      setModalOpen,
      userEmail,
      connectedUserData,
      userId,
      redirect,
      signOut,
      t,
    ]
  )

  const handleFilterEmail = useCallback((email: string) => {
    setFilter(email)
  }, [])

  const handleSetModalOpen = useCallback(() => {
    setModalOpen((prevState) => !prevState)
  }, [setModalOpen])

  const columns = useTableColumns({
    handleTriggerConfirmPopup,
    t,
  })

  const usersActions = usersActionsConfig({
    handleDeactivateAccount,
    handleReactivateAccount,
    handleDeleteAccount,
    t,
  })
  const currentActionConfig = userAction ? usersActions[userAction] : null

  useEffect(() => {
    setPageIndex(0)
  }, [filter])

  return (
    <div className="mt-4 flex w-full justify-center">
      <div className="flex w-[90%] flex-col gap-5">
        <DataTable
          columns={columns}
          data={usersData ?? []}
          columnFilter={"email"}
          noResultsMessage={t("table.noData")}
          filterPlaceholder={t("table.filterPlaceholder")}
          rowsPerPageLabel={t("table.pagination.rowsPerPage")}
          pageLabel={t("table.pagination.pageLabel")}
          ofLabel={t("table.pagination.ofLabel")}
          goToFirstPageLabel={t("table.pagination.firstPage")}
          goToPreviousPageLabel={t("table.pagination.previousPage")}
          goToNextPageLabel={t("table.pagination.nextPage")}
          goToLastPageLabel={t("table.pagination.lastPage")}
          totalElementsLabel={t("table.pagination.totalElements")}
          setPageSize={setPageSize}
          setPageIndex={setPageIndex}
          pageSize={pageSize}
          pageIndex={pageIndex}
          totalPages={pagination?.totalPages}
          totalElements={pagination?.totalUsers}
          onFilterChange={handleFilterEmail}
          withFilter={true}
        />
      </div>

      {modalOpen && currentActionConfig && (
        <AlertPopup<UserIdAdminAction>
          open={modalOpen}
          type={currentActionConfig.type}
          onClose={handleSetModalOpen}
          onConfirm={() => currentActionConfig.handler({ id: userId! })}
          titleKey={currentActionConfig.titleKey(userEmail!)}
          descriptionKey={currentActionConfig.descriptionKey}
          cancelKey={currentActionConfig.cancelKey}
          confirmKey={currentActionConfig.confirmKey}
        />
      )}
    </div>
  )
}

DashboardPage.getLayout = getAdminLayout

DashboardPage.title = "admin.users"

export default DashboardPage
