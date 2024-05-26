import { Avatar, AvatarImage, AvatarFallback, Text } from "@instamint/ui-kit"
import Link from "next/link"
import React from "react"

import { routes } from "@/web/routes"

type Props = {
  username: string
  userAvatar: string | null
  usernameFirstLetter: string | undefined
  location: string | null | undefined
  className?: string
}

const PublicationModalContentHeader = (props: Props) => {
  const { username, userAvatar, usernameFirstLetter, location, className } =
    props

  return (
    <div
      className={`border-b-1 flex h-fit w-full flex-row items-center gap-2 border-neutral-300 p-2 ${className} md:flex`}
    >
      <Link href={routes.client.profile.getProfile(username)}>
        <Avatar className="border-accent-500 size-8 border">
          {userAvatar ? (
            <AvatarImage src={userAvatar} alt={username} />
          ) : (
            <AvatarFallback>{usernameFirstLetter}</AvatarFallback>
          )}
        </Avatar>
      </Link>

      <div className="flex flex-col">
        <Link href={routes.client.profile.getProfile(username!)}>
          <Text type="medium" variant="none">
            {username}
          </Text>
        </Link>

        <Text type="small" variant="none">
          {location}
        </Text>
      </div>
    </div>
  )
}

export default PublicationModalContentHeader
