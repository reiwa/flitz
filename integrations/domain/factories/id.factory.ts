import { Id } from "integrations/domain/valueObjects"
import { nanoid } from "nanoid"

export class IdFactory {
  /**
   * nanoid
   * https://www.npmjs.com/package/nanoid
   * @returns
   */
  static nanoid() {
    return new Id(nanoid())
  }

  /**
   * Firebase向けのID
   * @returns
   */
  static autoId() {
    const seed =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"

    let text = ""

    for (var i = 0; i < seed.length; i++) {
      text += seed[Math.floor(Math.random() * seed.length)]
    }

    return new Id(text)
  }
}
