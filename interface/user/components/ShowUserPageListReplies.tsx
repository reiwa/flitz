import { useParam } from "@blitzjs/next"
import { useInfiniteQuery } from "@blitzjs/rpc"
import { Alert, AlertIcon, Box, StackDivider } from "@chakra-ui/react"
import { FC } from "react"
import { useTranslation } from "react-i18next"
import getUserReplies from "app/queries/getUserReplies"
import { StackList } from "interface/core/components/StackList"
import { BoxCardPost } from "interface/post/components/BoxCardPost"

export const ShowUserPageListReplies: FC = () => {
  const { t } = useTranslation()

  const username = useParam("username", "string")

  const [pages, { isFetching }] = useInfiniteQuery(
    getUserReplies,
    (page = { skip: 0, username }) => page,
    {
      getNextPageParam: (lastPage) => lastPage.nextPage,
      refetchInterval: 1000 * 2 ** 5,
    }
  )

  const posts = pages.flatMap((page) => page.items)

  const isEmpty = !isFetching && posts.length === 0

  return (
    <StackList divider={<StackDivider />}>
      {isEmpty && (
        <Box key={"empty"} px={4}>
          <Alert key={"alert"} status={"info"}>
            <AlertIcon />
            {t("This user hasn't posted yet.")}
          </Alert>
        </Box>
      )}
      {posts.map((post) => {
        return <BoxCardPost key={post.id} {...post} isDisabled={false} />
      })}
    </StackList>
  )
}
