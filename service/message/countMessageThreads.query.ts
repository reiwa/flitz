import { captureException } from "@sentry/node"
import { injectable } from "tsyringe"
import { Id } from "core"
import db from "db"
import { InternalError } from "infrastructure/errors"

type Props = {
  userId: Id
}

@injectable()
export class CountMessageThreadsQuery {
  async execute(props: Props) {
    try {
      const count = await db.messageThread.count({
        where: { userId: props.userId.value },
      })

      return count
    } catch (error) {
      captureException(error)
      return new InternalError()
    }
  }
}
