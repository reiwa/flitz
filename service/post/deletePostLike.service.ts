import { captureException } from "@sentry/node"
import { NotFoundError } from "blitz"
import { injectable } from "tsyringe"
import { Id } from "core"
import { LikeRepository } from "infrastructure"
import { InternalError } from "infrastructure/errors"

type Props = {
  userId: Id
  postId: Id
}

@injectable()
export class DeletePostLikeService {
  constructor(private likeRepository: LikeRepository) {}

  async execute(props: Props) {
    try {
      const like = await this.likeRepository.find(props.userId, props.postId)

      if (like instanceof Error) {
        return new InternalError()
      }

      if (like === null) {
        captureException("データが見つからなかった。")
        return new NotFoundError()
      }

      const transaction = await this.likeRepository.delete(like)

      if (transaction instanceof Error) {
        return new InternalError()
      }

      return null
    } catch (error) {
      captureException(error)
      return new InternalError()
    }
  }
}
