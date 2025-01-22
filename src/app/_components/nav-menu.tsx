'use client'

import { useRouter } from 'next/navigation'
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

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>&#9776;</DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>
          {session.data?.user.passphrase ?? 'Hello'}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        {session.status === 'loading' && (
          <DropdownMenuLabel>Loading...</DropdownMenuLabel>
        )}
        {session.status === 'unauthenticated' && (
          <DropdownMenuItem
            onClick={() => router.push('/login')}
            className="cursor-pointer"
          >
            Hustler&apos;s Login
          </DropdownMenuItem>
        )}
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
            <DropdownMenuSeparator />
          </>
        )}
        {session.status === 'authenticated' && (
          <DropdownMenuItem
            className="cursor-pointer"
            onClick={() => signOut()}
          >
            Sign Out
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
