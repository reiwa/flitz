import { Stack, StackProps, useColorModeValue } from "@chakra-ui/react"
import { FC } from "react"

type Props = StackProps

export const BoxCard: FC<Props> = (props) => {
  const bg = useColorModeValue("gray.50", "gray.700")

  return (
    <Stack
      _hover={{ bg }}
      cursor={"pointer"}
      p={4}
      rounded={{ base: 0, md: "md" }}
      spacing={4}
      transitionDuration={"250ms"}
      transitionProperty={"background-color"}
      {...props}
    />
  )
}
