import { StackDivider } from "@chakra-ui/react"
import { StackList } from "app/core/components/StackList"
import getReferences from "app/home/queries/getReferences"
import { BoxCardPost } from "app/posts/components/BoxCardPost"
import { useInfiniteQuery, useSession } from "blitz"
import { FC } from "react"

export const BoxHomeList: FC = () => {
  const session = useSession()

  const [pages] = useInfiniteQuery(
    getReferences,
    (page = { skip: 0 }) => page,
    {
      getNextPageParam: (lastPage) => lastPage.nextPage,
      refetchInterval: 1000 * 2 ** 3,
    }
  )

  const references = pages.flatMap((page) => page.items)

  return (
    <StackList divider={<StackDivider />}>
      {references.map((reference) => (
        <BoxCardPost
          key={reference.id}
          isDisabled={
            session.userId !== null && session.userId === reference.user.id
          }
          {...reference}
        />
      ))}
    </StackList>
  )
}
