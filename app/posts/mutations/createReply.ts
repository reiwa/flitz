import { Ctx, NotFoundError } from "blitz"
import db from "db"

type CreatePostInput = {
  text?: string
  replyId?: string
}

const createReply = async (input: CreatePostInput, ctx: Ctx) => {
  ctx.session.authorize()

  if (!input.replyId) {
    throw new NotFoundError()
  }

  if (!input.text || input.text?.trim().length === 0) {
    throw new Error("Invalid input")
  }

  const userId = ctx.session.userId

  const friendships = await db.friendship.findMany({
    where: { followeeId: userId },
    take: 20000,
  })

  const post = await db.post.update({
    data: {
      replies: {
        create: {
          text: input.text,
          user: { connect: { id: userId } },
          references: {
            create: [
              {
                user: { connect: { id: userId } },
              },
              ...friendships.map((friendship) => {
                return {
                  user: { connect: { id: friendship.followerId } },
                }
              }),
            ],
          },
        },
      },
      references: {
        update: {
          data: { hasReply: true },
          where: {
            userId_postId: {
              userId,
              postId: input.replyId,
            },
          },
        },
      },
      repliesCount: { increment: 1 },
    },
    include: {
      replies: {
        where: { userId },
      },
    },
    where: { id: input.replyId },
  })

  const [reply] = post.replies

  // await db.$transaction([
  //   ...friendships.map((friendship) => {
  //     return db.reference.create({
  //       data: {
  //         post: { connect: { id: reply.id } },
  //         user: { connect: { id: friendship.followerId } },
  //       },
  //     })
  //   }),
  // ])

  await db.notification.create({
    data: {
      post: { connect: { id: reply.id } },
      type: "REPLY",
      uniqueId: reply.id,
      user: { connect: { id: post.userId } },
    },
  })

  return post
}

export default createReply