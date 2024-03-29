import { FC } from "react"
import { useTranslation } from "react-i18next"
import { FiGlobe } from "react-icons/fi"
import { BoxButtonRoute } from "interface/core/layouts/components/BoxButtonRoute"

export const BoxButtonRouteLanguage: FC = () => {
  const { i18n } = useTranslation()

  const onClick = () => {
    i18n.changeLanguage(i18n.language === "en" ? "ja" : "en")
  }

  return (
    <BoxButtonRoute icon={FiGlobe} onClick={onClick}>
      {i18n.language === "en" ? "日本語" : "English"}
    </BoxButtonRoute>
  )
}
