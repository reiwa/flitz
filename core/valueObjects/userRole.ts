import { z } from "zod"

const zValue = z.union([
  z.literal("ADMIN"),
  z.literal("SYSTEM"),
  z.literal("USER"),
])

/**
 * ユーザーの権限
 */
export class UserRole {
  readonly key = "USER_ROLE"

  constructor(public value: z.infer<typeof zValue>) {
    zValue.parse(value)
    Object.freeze(this)
  }
}
