import { resolver } from "blitz"
import { PageService } from "integrations/domain/services"
import {
  Id,
  Skip,
  skipSchema,
  Take,
  Username,
  usernameSchema,
} from "integrations/domain/valueObjects"
import { FriendshipRepository } from "integrations/infrastructure/repositories"
import * as z from "zod"

const GetUserFollowersInfinite = z.object({
  skip: skipSchema,
  username: usernameSchema,
})

export default resolver.pipe(
  resolver.zod(GetUserFollowersInfinite),
  (input, ctx) => ({
    skip: new Skip(input.skip),
    take: new Take(),
    userId: Id.nullable(ctx.session.userId),
    username: new Username(input.username),
  }),
  async ({ skip, take, userId, username }) => {
    const friendshipRepository = new FriendshipRepository()

    const {
      friendships,
    } = await friendshipRepository.getUserFollowersByUsername({
      skip,
      take,
      userId,
      username,
    })

    const count = await friendshipRepository.countUserFollowers({ username })

    const pageService = new PageService()

    const hasMore = pageService.hasMore({ count, skip, take })

    const nextPage = hasMore ? pageService.nextPage({ take, skip }) : null

    return { count, hasMore, friendships, nextPage }
  }
)
