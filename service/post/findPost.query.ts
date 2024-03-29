import { captureException } from "@sentry/node"
import { NotFoundError } from "blitz"
import { injectable } from "tsyringe"
import { Id } from "core"
import db from "db"
import { PrismaPost } from "infrastructure"
import { InternalError } from "infrastructure/errors"
import { toAppPost } from "infrastructure/utils"
import { includePostEmbedded } from "infrastructure/utils/includePostEmbedded"

type Props = {
  postId: Id
  userId: Id | null
}

@injectable()
export class FindPostQuery {
  async execute(props: Props) {
    try {
      const post: PrismaPost | null = await db.post.findUnique({
        where: { id: props.postId.value },
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

      if (post === null) {
        captureException("データが見つからなかった。")
        return new NotFoundError()
      }

      return toAppPost(post)
    } catch (error) {
      captureException(error)
      return new InternalError()
    }
  }
}
