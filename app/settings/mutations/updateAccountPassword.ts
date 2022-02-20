import { withSentry } from "app/core/utils/withSentry"
import { resolver } from "blitz"
import { UpdateAccountPasswordService } from "integrations/application"
import { Id, Password } from "integrations/domain"
import { container } from "tsyringe"
import { z } from "zod"

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
      UpdateAccountPasswordService
    )

    await updateAccountPasswordService.execute({
      currentPassword: props.currentPassword,
      password: props.password,
      userId: props.userId,
    })

    return null
  }
)

export default withSentry(updateAccountPassword, "updateAccountPassword")
