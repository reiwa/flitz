import { SecurePassword } from "@blitzjs/auth"
import { captureException } from "@sentry/node"
import { AuthenticationError, NotFoundError } from "blitz"
import { injectable } from "tsyringe"
import { HashedPassword, Id, Password } from "core"
import { UserRepository } from "infrastructure"
import { InternalError } from "infrastructure/errors"

type Props = {
  userId: Id
  password: Password
  currentPassword: Password
}

@injectable()
export class UpdateUserPasswordService {
  constructor(private userRepository: UserRepository) {}

  async execute(props: Props) {
    try {
      const user = await this.userRepository.find(props.userId)

      if (user instanceof Error) {
        return new InternalError()
      }

      if (user === null) {
        captureException("データが見つからなかった。")
        return new NotFoundError()
      }

      const result = await SecurePassword.verify(
        user.hashedPassword.value,
        props.currentPassword.value
      )

      if (
        result !== SecurePassword.VALID &&
        result !== SecurePassword.VALID_NEEDS_REHASH
      ) {
        return new AuthenticationError()
      }

      const improvedHash = await SecurePassword.hash(props.password.value)

      const draftHashPassword = new HashedPassword(improvedHash)

      const draftUser = user.updateHashedPassword(draftHashPassword)

      const transaction = await this.userRepository.upsert(draftUser)

      if (transaction instanceof Error) {
        return new InternalError()
      }

      return null
    } catch (error) {
      captureException(error)
      return new InternalError()
    }
  }
}
