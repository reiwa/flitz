import { withSentry } from "app/core/utils/withSentry"
import { resolver } from "blitz"
import { TestNotificationService } from "integrations/application"
import { Id } from "integrations/domain"
import { container } from "tsyringe"
import { z } from "zod"

const zProps = z.null()

const testNotification = resolver.pipe(
  resolver.zod(zProps),
  resolver.authorize(),
  (_, ctx) => {
    return {
      userId: new Id(ctx.session.userId),
    }
  },
  async (props) => {
    const testNotificationService = container.resolve(TestNotificationService)

    const result = await testNotificationService.execute({
      userId: props.userId,
    })

    if (result instanceof Error) {
      throw result
    }

    return null
  }
)

export default withSentry(testNotification, "testNotification")
