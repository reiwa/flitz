import { captureException } from "@sentry/node"
import {
  Email,
  HashedPasswordFactory,
  IdFactory,
  Password,
  ShortText,
  UserEntity,
  UsernameFactory,
} from "integrations/domain"
import { InternalError } from "integrations/errors"
import { UserRepository } from "integrations/infrastructure"
import { injectable } from "tsyringe"

type Props = {
  password: Password
  email: Email
}

@injectable()
export class SignUpService {
  constructor(private userRepository: UserRepository) {}

  /**
   * ユーザーを作成する
   * @param props
   * @returns
   */
  async execute(props: Props) {
    try {
      const hashedPassword = await HashedPasswordFactory.fromPassword(
        props.password
      )

      const userId = IdFactory.nanoid()

      const user = new UserEntity({
        biography: new ShortText(""),
        hashedPassword,
        headerImageId: null,
        iconImageId: null,
        id: userId,
        name: null,
        username: UsernameFactory.random(),
        email: props.email,
        fcmToken: null,
        fcmTokenForMobile: null,
        isProtected: false,
        isPublicEmail: false,
        isEnabledNotificationEmail: true,
        isEnabledNotificationMessage: true,
        isEnabledNotificationPostLike: true,
        isEnabledNotificationPostQuotation: true,
      })

      const upsertUser = await this.userRepository.upsert(user)

      if (upsertUser instanceof Error) {
        return new InternalError()
      }

      return user
    } catch (error) {
      captureException(error)

      if (error instanceof Error) {
        return new InternalError(error.message)
      }

      return new InternalError()
    }
  }
}
