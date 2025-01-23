'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { api } from '@/trpc/react'
import { signOut, useSession } from 'next-auth/react'

export const NavMenu = () => {
  const session = useSession()
  const router = useRouter()
  const { data: biz } = api.business.getMyBiz.useQuery(undefined, {
    enabled: session.status === 'authenticated',
  })

  if (session.status === 'unauthenticated') {
    return (
      <Button variant="ghost" onClick={() => router.push('/login')}>
        Login
      </Button>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>&#9776;</DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel onClick={() => router.push('/me/code')}>
          {session.data?.user.passphrase}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        {biz && (
          <>
            <DropdownMenuItem
              className="cursor-pointer"
              onClick={() => router.push(`/biz/${biz?.id}`)}
            >
              View Business
            </DropdownMenuItem>
            <DropdownMenuItem
              className="cursor-pointer"
              onClick={() => router.push(`/biz/${biz?.id}/edit`)}
            >
              Edit Business
            </DropdownMenuItem>
          </>
        )}

        <DropdownMenuItem
          className="cursor-pointer"
          onClick={() => router.push(`/me/bookmarks`)}
        >
          My Bookmarks
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="cursor-pointer"
          onClick={() => signOut({ redirectTo: '/' })}
        >
          Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
