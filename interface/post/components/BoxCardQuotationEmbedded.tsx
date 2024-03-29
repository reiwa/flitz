import { HStack, Stack, Text, useColorModeValue } from "@chakra-ui/react"
import { useRouter } from "next/router"
import { FC } from "react"
import { AppQuotation } from "infrastructure/models/appQuotation"
import { AvatarUser } from "interface/core/components/AvatarUser"

type Props = AppQuotation

export const BoxCardQuotationEmbedded: FC<Props> = (props) => {
  const hoverBg = useColorModeValue("gray.200", "gray.600")

  const bg = useColorModeValue("gray.50", "gray.700")

  const router = useRouter()

  const onClickQuotation = () => {
    router.push(`/posts/${props.id}`)
  }

  return (
    <Stack
      _hover={{ bg: hoverBg }}
      bg={bg}
      borderWidth={"1px"}
      p={4}
      rounded={"md"}
      spacing={2}
      transition={"all 250ms"}
      onClick={(event) => {
        event.stopPropagation()
        onClickQuotation()
      }}
    >
      <HStack align={"center"} spacing={2}>
        <AvatarUser userId={props.user.id} size={"sm"} />
        {props.user.name && <Text fontWeight={"bold"}>{props.user.name}</Text>}
        {props.user.name ? (
          <Text color={"gray.500"} fontSize={"sm"}>
            {`@${props.user.username || props.user.id}`}
          </Text>
        ) : (
          <Text fontWeight={"bold"}>{`@${
            props.user.username || props.user.id
          }`}</Text>
        )}
      </HStack>
      {props.text && (
        <Text fontSize={"lg"} fontWeight={"bold"}>
          {props.text}
        </Text>
      )}
      <HStack align={"center"} spacing={2}>
        <Text color={"gray.500"} fontSize={"sm"}>
          {props.createdAt.toLocaleTimeString()}
        </Text>
        <Text color={"gray.500"} fontSize={"sm"}>
          {props.createdAt.toDateString()}
        </Text>
      </HStack>
    </Stack>
  )
}
