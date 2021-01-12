import { StackDivider } from "@chakra-ui/react"
import { StackHeader } from "app/components/StackHeader"
import { StackPage } from "app/components/StackMain"
import Layout from "app/layouts/Layout"
import { SettingsPageLogout } from "app/settings/components/SettingsPageLogout"
import { BlitzPage } from "blitz"
import React from "react"
import { useTranslation } from "react-i18next"

const SettingsPage: BlitzPage = () => {
  const { t } = useTranslation()

  return (
    <StackPage divider={<StackDivider />}>
      <StackHeader>{t("Settings")}</StackHeader>
      <SettingsPageLogout />
    </StackPage>
  )
}

SettingsPage.getLayout = (page) => {
  return <Layout title={"Settings"}>{page}</Layout>
}

export default SettingsPage
