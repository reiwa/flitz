import {
  AspectRatio,
  Button,
  HStack,
  Icon,
  Image,
  Stack,
  useToast,
} from "@chakra-ui/react"
import { AvatarUser } from "app/core/components/AvatarUser"
import { ButtonFile } from "app/core/components/ButtonFile"
import { TextareaAutosize } from "app/core/components/TextareaAutosize"
import { useCloudStorage } from "app/core/hooks/useCloudStorage"
import { useFileURL } from "app/core/hooks/useFileURL"
import createPost from "app/posts/mutations/createPost"
import { useMutation, useSession } from "blitz"
import { FC, useState } from "react"
import { useTranslation } from "react-i18next"
import { FiSend } from "react-icons/fi"

export const BoxHomeFormPost: FC = () => {
  const session = useSession()

  const { t } = useTranslation()

  const [text, setText] = useState("")

  const [file, setFile] = useState<File | null>(null)

  const [createPostMutation, { isLoading: isLoadingPost }] =
    useMutation(createPost)

  const [uploadFileMutation, { isLoading: isLoadingFile }] = useCloudStorage()

  const toast = useToast()

  const [headerImageFileURL] = useFileURL(file)

  const onCreatePost = async () => {
    try {
      if (file !== null) {
        const { fileId } = await uploadFileMutation(file)
        await createPostMutation({ text, fileId })
      }
      if (file === null) {
        await createPostMutation({ text, fileId: null })
      }
      setText("")
      setFile(null)
      toast({ status: "success", title: "Success" })
    } catch (error) {
      if (error instanceof Error) {
        toast({ status: "error", title: error.message })
      }
    }
  }

  const isDisabled = text.trim().length === 0 && !file

  const isLoading = isLoadingPost || isLoadingFile

  return (
    <Stack spacing={4} px={4}>
      <HStack w={"full"} spacing={4} align={"flex-start"}>
        <AvatarUser userId={session.userId} fileId={session.iconImageId} />
        <Stack w={"full"} spacing={4} align={"flex-start"}>
          <TextareaAutosize
            isDisabled={isLoading}
            onChange={(event) => setText(event.target.value)}
            placeholder={t`What's happening?`}
            minRows={2}
            value={text}
            w={"full"}
          />
          {headerImageFileURL && (
            <HStack w={"full"} bg={"white"} rounded={"md"} overflow={"hidden"}>
              <AspectRatio w={"full"} ratio={1 / 0.5625}>
                <Image
                  alt={headerImageFileURL}
                  src={headerImageFileURL}
                  borderRadius={"md"}
                  style={{ filter: "brightness(0.5)" }}
                />
              </AspectRatio>
            </HStack>
          )}
        </Stack>
      </HStack>
      <HStack pl={14} spacing={4} justify={"flex-end"}>
        <ButtonFile
          aria-label={"Image"}
          isDisabled={isLoading}
          onChange={(file) => setFile(file)}
        >
          {t`Image`}
        </ButtonFile>
        <Button
          aria-label={"Submit"}
          isDisabled={isDisabled}
          isLoading={isLoading}
          leftIcon={<Icon as={FiSend} />}
          loadingText={t`Submit`}
          onClick={onCreatePost}
          variant={"outline"}
        >
          {t`Submit`}
        </Button>
      </HStack>
    </Stack>
  )
}
