import { resolver } from "@blitzjs/rpc"
import { paginate } from "blitz"
import { container } from "tsyringe"
import { z } from "zod"
import { Id } from "core"
import { withSentry } from "interface/core/utils/withSentry"
import { CountMessageThreadsQuery, FindMessageThreadsQuery } from "service"

const zProps = z.object({ skip: z.number() })

const getMessageThreads = resolver.pipe(
  resolver.zod(zProps),
  resolver.authorize(),
  (props, ctx) => {
    return {
      skip: props.skip,
      take: 16,
      userId: new Id(ctx.session.userId),
    }
  },
  async (props) => {
    const query = container.resolve(FindMessageThreadsQuery)

    const messageThreads = await query.execute({
      userId: props.userId,
      skip: props.skip,
    })

    if (messageThreads instanceof Error) {
      throw messageThreads
    }

    const countQuery = container.resolve(CountMessageThreadsQuery)

    const count = await countQuery.execute({ userId: props.userId })

    if (count instanceof Error) {
      throw count
    }

    return paginate({
      skip: props.skip,
      take: props.take,
      async count() {
        return count
      },
      async query() {
        return messageThreads
      },
    })
  }
)

export default withSentry(getMessageThreads, "getMessageThreads")
