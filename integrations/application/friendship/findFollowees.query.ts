import db from "db"
import { Id, Username } from "integrations/domain"
import { QueryConverter } from "integrations/infrastructure/converters"
import { AppFollower } from "integrations/interface/types/appFollower"
import { injectable } from "tsyringe"

type Props = {
  skip: number
  take: number
  userId: Id | null
  username: Username
}

@injectable()
export class FindFolloweesQuery {
  constructor(private queryConverter: QueryConverter) {}

  async execute(props: Props): Promise<AppFollower[]> {
    const friendships = await db.friendship.findMany({
      include: {
        followee: {
          include: {
            followees: props.userId
              ? { where: { followeeId: props.userId.value } }
              : false,
            followers: props.userId
              ? { where: { followerId: props.userId.value } }
              : false,
          },
        },
      },
      orderBy: { createdAt: "desc" },
      skip: props.skip,
      take: props.take,
      where: { follower: { username: props.username.value } },
    })

    return friendships.map((friendship) => {
      return this.queryConverter.toFollowee(friendship)
    })
  }
}
