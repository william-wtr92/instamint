import { type ReactElement } from "react"
import type { GetServerSideProps } from "next"
// import { useTranslation } from "next-i18next"
import { serverSideTranslations } from "next-i18next/serverSideTranslations"
// import {
//   type DeleteAccount,
//   // type UserInfosSchema,
// } from "@instamint/shared-types"

// import useAppContext from "@/web/contexts/useAppContext"
// import useActionsContext from "@/web/contexts/useActionsContext"
import getTranslationBaseImports from "@/web/utils/helpers/getTranslationBaseImports"
// import { routes } from "@/web/routes"
import SettingsLayout from "@/web/components/layout/SettingsLayout"
import { Text } from "@instamint/ui-kit"
// import { useUser } from "@/web/hooks/auth/useUser"

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { locale } = context

  return {
    props: {
      ...(await serverSideTranslations(locale ?? "en", [
        ...getTranslationBaseImports(),
        "profile-settings",
      ])),
    },
  }
}

const SettingsPage = () => {
  // const { t } = useTranslation(["errors", "profile-settings"])

  // const { data, isLoading } = useUser()
  // const user = isLoading ? null : data

  // const [viewSettings, setViewSettings] = useState<string>("username-settings")

  // const {
  //   services: {
  //     users: { deleteAccount },
  //   },
  // } = useAppContext()

  // const { redirect, toast } = useActionsContext()

  // const onSubmit = useCallback(
  //   async (values: UserInfosSchema) => {
  //     const [err] = await updateUserInfos(values)

  //     if (err) {
  //       setError(
  //         t(`errors:users.profile-settings.update-account.${err.message}`)
  //       )

  //       return
  //     }

  //     setSuccess(t("profile-settings:update-account.success"))
  //   },
  //   [updateUserInfos, setSuccess, t, setError]
  // )

  // const handleChangeViewSettings = useCallback(
  //   (setting: string) => () => {
  //     setViewSettings(setting)
  //   },
  //   [setViewSettings]
  // )

  // const handleDeleteAccountSubmit = useCallback(
  //   async (values: DeleteAccount) => {
  //     const [err] = await deleteAccount(values)

  //     if (err) {
  //       toast({
  //         variant: "error",
  //         description: t(
  //           `errors:users.profile-settings.delete-account.${err.message}`
  //         ),
  //       })

  //       return
  //     }

  //     toast({
  //       variant: "success",
  //       description: t("profile-settings:delete-account.success"),
  //     })

  //     redirect(routes.client.home, 3000)
  //   },
  //   [redirect, deleteAccount, t, toast]
  // )

  return (
    <div className="animate-slideInFromLeft z-10 flex justify-start gap-4 border border-red-500 p-4">
      <div className="flex flex-grow flex-col gap-5 border border-blue-500 p-5">
        <div className="w-full rounded-md p-4 outline-dotted outline-2 xl:w-1/5">
          <Text type="subheading" variant="neutral">
            La c'est la page
          </Text>
          {/* <DeleteAccountForm
            onSubmit={handleDeleteAccountSubmit}
            success={success}
            error={error}
          /> */}
        </div>
      </div>
    </div>
    // <div className="flex h-screen flex-col items-center justify-center">
    //   <div className="w-[85%] sm:w-[70%] lg:w-[80%] xl:h-[70%]">
    //     <div className="h-full w-full rounded-lg border-2 border-solid p-4 shadow-xl lg:grid lg:grid-cols-3">
    //       <div className=" lg:border-accent-200 col-span-1 grid grid-rows-5 lg:border-r-4 lg:border-solid">
    //         <div className="border-accent-200 mr-4 border-b-4 border-solid p-3 font-semibold">
    //           <p onClick={handleChangeViewSettings("username-settings")}>
    //             {t("profile-settings:update-account.username.label")}
    //           </p>
    //         </div>
    //         <div className="border-accent-200 mr-4 border-b-4 border-solid p-3 font-semibold xl:p-5">
    //           <p onClick={handleChangeViewSettings("bio-settings")}>
    //             {t("profile-settings:update-account.bio.label")}
    //           </p>
    //         </div>
    //         <div className="border-accent-200 mr-4 border-b-4 border-solid p-3 font-semibold xl:p-5">
    //           <p onClick={handleChangeViewSettings("link-settings")}>
    //             {t("profile-settings:update-account.link.label")}
    //           </p>
    //         </div>
    //         <div className="border-accent-200 mr-4  border-b-4 border-solid p-3 font-semibold xl:p-5">
    //           <p onClick={handleChangeViewSettings("picture-settings")}>
    //             {t("profile-settings:update-account.picture.label")}
    //           </p>
    //         </div>
    //         <div className="p-3 xl:p-5">
    //           <DeleteAccountForm
    //             onSubmit={handleDeleteAccountSubmit}
    //             success={success}
    //             error={error}
    //           />
    //         </div>
    //       </div>
    //       <div className="flex w-full items-center justify-center p-5 lg:col-span-2">
    //         {user && (
    //           <UpdateUserInfos
    //             settingsRequired={viewSettings}
    //             user={user}
    //             success={success}
    //             error={error}
    //             onSubmit={onSubmit}
    //           />
    //         )}
    //       </div>
  )
}
SettingsPage.title = "profile.settings.general"

SettingsPage.getLayout = (page: ReactElement) => {
  return <SettingsLayout>{page}</SettingsLayout>
}

export default SettingsPage
