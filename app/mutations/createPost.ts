import { resolver } from "@blitzjs/rpc"
import { container } from "tsyringe"
import { Id, PostText } from "core"
import { withSentry } from "interface/core/utils/withSentry"
import { zCreatePostMutation } from "interface/post/validations/createPostMutation"
import { CreateFileService, CreatePostService } from "service"

const createPost = resolver.pipe(
  resolver.zod(zCreatePostMutation),
  resolver.authorize(),
  (props, ctx) => {
    return {
      fileId: props.fileId ? new Id(props.fileId) : null,
      text: new PostText(props.text),
      userId: new Id(ctx.session.userId),
    }
  },
  async (props) => {
    const createFileService = container.resolve(CreateFileService)

    if (props.fileId !== null) {
      const file = await createFileService.execute({
        userId: props.userId,
        fileId: props.fileId,
      })

      if (file instanceof Error) {
        throw file
      }
    }

    const service = container.resolve(CreatePostService)

    const result = await service.execute({
      fileIds: props.fileId ? [props.fileId] : [],
      text: props.text,
      userId: props.userId,
    })

    if (result instanceof Error) {
      throw result
    }

    return null
  }
)

export default withSentry(createPost, "createPost")
