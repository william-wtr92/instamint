import {
  CommandDialog,
  CommandInput,
  CommandList,
  CommandGroup,
  CommandItem,
  CommandEmpty,
} from "@instamint/ui-kit"
import Link from "next/link"
import { useTranslation } from "next-i18next"
import React, { useCallback, useState } from "react"

import { useSearch } from "@/web/hooks/search/useSearch"
import { routes } from "@/web/routes"

type Props = {
  open: boolean
  setOpen: (open: boolean) => void
}

const MIN_QUERY_LENGTH = 3

export const SearchBox = ({ open, setOpen }: Props) => {
  const { t } = useTranslation("navbar")

  const [searchQuery, setSearchQuery] = useState<string>("")

  const { data, isValidating, size, setSize, mutate } = useSearch({
    query: searchQuery,
  })

  const users = data ? data.flatMap((page) => page.result.users) : []

  const handleSearch = useCallback(
    async (search: string) => {
      setSearchQuery(search)
      await mutate()
    },
    [mutate]
  )

  const handleLinkClick = useCallback(() => {
    setOpen(false)
  }, [setOpen])

  const loadMoreResults = useCallback(async () => {
    if (!isValidating) {
      await setSize(size + 1)
    }
  }, [isValidating, size, setSize])

  const handleScroll = useCallback(
    async (e: React.UIEvent<HTMLDivElement>) => {
      const bottom =
        e.currentTarget.scrollHeight - e.currentTarget.scrollTop ===
        e.currentTarget.clientHeight

      if (bottom) {
        await loadMoreResults()
      }
    },
    [loadMoreResults]
  )

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput
        placeholder={t("search.placeholder")}
        onValueChange={handleSearch}
      />
      <CommandList className="p-0" onScroll={handleScroll}>
        {users.length === 0 && searchQuery.length > MIN_QUERY_LENGTH && (
          <CommandEmpty>No users found</CommandEmpty>
        )}
        {users.length > 0 && (
          <CommandGroup title={t("search.results")}>
            {users.map((user) => (
              <CommandItem key={user.id}>
                <Link
                  href={routes.client.profile.getProfile(user.username)}
                  onClick={handleLinkClick}
                >
                  {user.username}
                </Link>
              </CommandItem>
            ))}
          </CommandGroup>
        )}
      </CommandList>
    </CommandDialog>
  )
}
