import { useColorMode } from "@chakra-ui/react"
import { FC } from "react"
import { useTranslation } from "react-i18next"
import { FiMoon, FiSun } from "react-icons/fi"
import { BoxButtonRoute } from "interface/core/layouts/components/BoxButtonRoute"

export const BoxButtonRouteDarkMode: FC = () => {
  const { t } = useTranslation()

  const { colorMode, toggleColorMode } = useColorMode()

  return (
    <BoxButtonRoute
      icon={colorMode === "light" ? FiSun : FiMoon}
      onClick={toggleColorMode}
    >
      {colorMode === "light" ? t("Light Mode") : t("Dark Mode")}
    </BoxButtonRoute>
  )
}
