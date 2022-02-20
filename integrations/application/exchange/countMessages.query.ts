import { captureException } from "@sentry/node"
import db from "db"
import { Id } from "integrations/domain/valueObjects"
import { InternalError } from "integrations/errors"
import { injectable } from "tsyringe"

type Props = {
  exchangeId: Id
}

@injectable()
export class CountMessagesQuery {
  async execute(props: Props) {
    try {
      const count = await db.message.count({
        where: { id: props.exchangeId.value },
      })

      return count
    } catch (error) {
      captureException(error)

      if (error instanceof Error) {
        return new InternalError(error.message)
      }

      return new InternalError()
    }
  }
}
