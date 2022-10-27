import { captureException } from "@sentry/node"
import { injectable } from "tsyringe"
import { Id } from "core"
import db from "db"
import { AppPostConverter } from "infrastructure"
import { includePostEmbedded } from "infrastructure/utils/includePostEmbedded"
import { InternalError } from "integrations/errors"

type Props = {
  skip: number
  userId: Id | null
}

@injectable()
export class FindLatestPostsQuery {
  constructor(private appPostConverter: AppPostConverter) {}

  async execute(props: Props) {
    try {
      const posts = await db.post.findMany({
        orderBy: { createdAt: "desc" },
        skip: props.skip,
        take: 16,
        include: {
          files: true,
          likes: props.userId
            ? { where: { userId: props.userId.value } }
            : false,
          quotation: { include: includePostEmbedded(props.userId) },
          quotations: props.userId
            ? { where: { userId: props.userId.value } }
            : false,
          replies: props.userId
            ? { where: { userId: props.userId.value } }
            : false,
          reply: { include: includePostEmbedded(props.userId) },
          user: { include: { iconImage: true } },
        },
      })

      return posts.map((post) => {
        return this.appPostConverter.fromPrisma(post)
      })
    } catch (error) {
      captureException(error)
      return new InternalError()
    }
  }
}
