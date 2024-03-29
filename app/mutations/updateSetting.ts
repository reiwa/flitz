import { resolver } from "@blitzjs/rpc"
import { container } from "tsyringe"
import { z } from "zod"
import { Id } from "core"
import { withSentry } from "interface/core/utils/withSentry"
import { FindUserSettingQuery, UpdateUserSettingService } from "service"

const zUpdateSettingMutation = z.object({
  fcmToken: z.string().nullable().optional(),
  fcmTokenForMobile: z.string().nullable().optional(),
  isEnabledNotificationMessage: z.boolean().optional(),
  isEnabledNotificationPostLike: z.boolean().optional(),
  isEnabledNotificationPostQuotation: z.boolean().optional(),
})

const updateSetting = resolver.pipe(
  resolver.zod(zUpdateSettingMutation),
  resolver.authorize(),
  async (props, ctx) => {
    const service = container.resolve(UpdateUserSettingService)

    const result = await service.execute({
      fcmTokenForMobile: props.fcmTokenForMobile ?? null,
      fcmToken: props.fcmToken ?? null,
      userId: new Id(ctx.session.userId),
    })

    if (result instanceof Error) {
      throw result
    }

    const findUserSettingQuery = container.resolve(FindUserSettingQuery)

    const appSetting = await findUserSettingQuery.execute({
      userId: new Id(ctx.session.userId),
    })

    if (appSetting instanceof Error) {
      throw appSetting
    }

    return appSetting
  }
)

export default withSentry(updateSetting, "updateSetting")
