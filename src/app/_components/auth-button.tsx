'use client'

import { type MouseEventHandler } from 'react'
import { signIn, signOut, useSession } from 'next-auth/react'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu'

const SignOutButton = ({
  onSignOut,
  passphrase,
}: {
  onSignOut?: MouseEventHandler<HTMLDivElement>
  passphrase: string
}) => (
  <DropdownMenu>
    <DropdownMenuTrigger className="rounded-md bg-light-brown px-3 py-2">
      &#9776;
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end">
      <DropdownMenuLabel>{passphrase}</DropdownMenuLabel>
      <DropdownMenuSeparator />
      <DropdownMenuItem className="cursor-pointer" onClick={onSignOut}>
        Sign Out
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
)

const AuthComponentButton = ({
  onClick,
  transparent,
  children,
}: {
  onClick?: MouseEventHandler<HTMLDivElement>
  transparent?: boolean
  children: React.ReactNode
}) => (
  <div
    onClick={onClick}
    className={`flex gap-4 rounded-md ${transparent ? '' : 'bg-light-brown'} p-1`}
  >
    <div className="flex cursor-pointer flex-col place-content-center">
      <div className="text-dark-brown">{children}</div>
    </div>
  </div>
)

export const AuthButton = () => {
  const session = useSession()
  switch (session.status) {
    case 'authenticated':
      return (
        <SignOutButton
          onSignOut={() => signOut()}
          passphrase={session.data.user.passphrase}
        />
      )
    case 'loading':
      return (
        <div className="flex flex-col place-content-center text-dark-brown">
          Loading...
        </div>
      )
    case 'unauthenticated':
      return (
        <div className="flex flex-row gap-2">
          <div className="flex flex-col place-content-center text-sm">
            <AuthComponentButton
              onClick={() => signIn('register')}
              transparent={true}
            >
              New Account
            </AuthComponentButton>
          </div>
          <AuthComponentButton onClick={() => signIn('passphrase')}>
            Sign In
          </AuthComponentButton>
        </div>
      )
  }
}
