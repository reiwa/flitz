import { StackDivider } from "@chakra-ui/react"
import { StackList } from "app/core/components/StackList"
import getReferences from "app/home/queries/getReferences"
import { StackCardPost } from "app/posts/components/StackCardPost"
import { useInfiniteQuery, useSession } from "blitz"
import React, { VFC } from "react"

export const HomePageList: VFC = () => {
  const session = useSession()

  const [pages] = useInfiniteQuery(
    getReferences,
    (page = { skip: 0 }) => page,
    {
      getNextPageParam: (lastGroup) => lastGroup.nextPage,
      refetchInterval: 1000 * 2 ** 3,
    }
  )

  const references = pages.flatMap((page) => page.items)

  return (
    <StackList divider={<StackDivider />}>
      {references.map((reference) => (
        <StackCardPost
          isDisabled={
            session.userId !== null && session.userId === reference.user.id
          }
          {...reference}
        />
      ))}
    </StackList>
  )
}
