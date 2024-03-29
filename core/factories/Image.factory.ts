import { z } from "zod"
import { Image } from "core/valueObjects"

export const dataURLSchema = z.string().regex(/^data:([\w/\-.]+);base64,/)

/**
 * 画像
 */
export class ImageFactory {
  static fromDataURL(dataURL: string | null) {
    if (dataURL === null) return null

    dataURLSchema.parse(dataURL)

    const base64 = dataURL.slice(dataURL.indexOf(",") + 1)

    return new Image(Buffer.from(base64, "base64"))
  }
}
