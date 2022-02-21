import {
  Avatar,
  AvatarGroup,
  HStack,
  Icon,
  Stack,
  Text,
} from "@chakra-ui/react"
import { AvatarUser } from "app/core/components/AvatarUser"
import { BoxCard } from "app/core/components/BoxCard"
import { AppNotificationFollow } from "integrations/interface/types/appNotificationFollow"
import React, { VFC } from "react"
import { FiUserPlus } from "react-icons/fi"

type Props = AppNotificationFollow

export const BoxCardNotificationFriendship: VFC<Props> = (props) => {
  return (
    <BoxCard>
      <HStack spacing={4}>
        <Stack>
          <AvatarGroup size={"md"}>
            <AvatarUser
              userId={props.embedded.id}
              fileId={props.embedded.iconImageId}
            />
            <Avatar bg={"gray.100"} icon={<Icon as={FiUserPlus} />} />
          </AvatarGroup>
        </Stack>
        <HStack spacing={2}>
          <Text fontWeight={"bold"}>
            {props.embedded.name || props.embedded.username}
          </Text>
          <Text>{"followed you"}</Text>
        </HStack>
      </HStack>
    </BoxCard>
  )
}