import { resolver } from "@blitzjs/rpc"
import { container } from "tsyringe"
import { z } from "zod"
import { UpdateUserPasswordService } from "application"
import { Id, Password } from "core"
import { withSentry } from "interface/core/utils/withSentry"

const zUpdateAccountPassword = z.object({
  currentPassword: z.string(),
  password: z.string(),
})

const updateAccountPassword = resolver.pipe(
  resolver.zod(zUpdateAccountPassword),
  resolver.authorize(),
  (props, ctx) => {
    return {
      currentPassword: new Password(props.currentPassword),
      password: new Password(props.password),
      userId: new Id(ctx.session.userId),
    }
  },
  async (props) => {
    const updateAccountPasswordService = container.resolve(
      UpdateUserPasswordService
    )

    const transaction = await updateAccountPasswordService.execute({
      currentPassword: props.currentPassword,
      password: props.password,
      userId: props.userId,
    })

    if (transaction instanceof Error) {
      throw transaction
    }

    return null
  }
)

export default withSentry(updateAccountPassword, "updateAccountPassword")