import { StackDivider } from "@chakra-ui/react"
import { StackHeader } from "app/components/StackHeader"
import { StackPage } from "app/components/StackMain"
import { ExchangesPageList } from "app/exchanges/components/ExchangesPageList"
import Layout from "app/layouts/Layout"
import { BlitzPage } from "blitz"
import React, { Suspense } from "react"
import { useTranslation } from "react-i18next"

const ExchangesPage: BlitzPage = () => {
  const { t } = useTranslation()

  return (
    <StackPage divider={<StackDivider />}>
      <StackHeader>{t("Messages")}</StackHeader>
      <Suspense fallback={<div>{"Loading..."}</div>}>
        <ExchangesPageList />
      </Suspense>
    </StackPage>
  )
}

ExchangesPage.getLayout = (page) => {
  return <Layout title={"Messages"}>{page}</Layout>
}

export default ExchangesPage
