import { Stack, Text } from "@chakra-ui/react"
import { FC } from "react"

type Props = {
  id: string
  name: string | null
  username: string
}

export const BoxPostReply: FC<Props> = (props) => {
  return (
    <Stack>
      <Text
        color={"primary.500"}
        fontWeight={"bold"}
        fontSize={"sm"}
        lineHeight={1}
      >
        {`Replying to @${props.name}`}
      </Text>
    </Stack>
  )
}
