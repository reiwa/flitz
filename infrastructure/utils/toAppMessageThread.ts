import { AppMessageThread } from "infrastructure/models"
import { PrismaMessageThread } from "infrastructure/types"
import { toAppUserEmbedded } from "infrastructure/utils/toAppUserEmbedded"

export const toAppMessageThread = (
  prismaMessageThread: PrismaMessageThread
): AppMessageThread => {
  const [message] = prismaMessageThread.messages

  return {
    id: prismaMessageThread.id,
    createdAt: prismaMessageThread.createdAt,
    isRead: prismaMessageThread.isRead,
    lastMessage: {
      id: message.id,
      createdAt: message.createdAt,
      text: message.text,
      userId: message.userId,
    },
    relatedUser: toAppUserEmbedded(prismaMessageThread.relatedUser),
  }
}
