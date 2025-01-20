'use client'

import { type MouseEventHandler } from 'react'
import { signIn, signOut, useSession } from 'next-auth/react'

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
    className={`flex gap-4 rounded-md ${transparent ? '' : 'bg-accent'} p-1`}
  >
    <div className="flex cursor-pointer flex-col place-content-center">
      <div className="text-primary">{children}</div>
    </div>
  </div>
)

export const AuthButton = () => {
  const session = useSession()
  switch (session.status) {
    case 'authenticated':
      return (
        <AuthComponentButton onClick={() => signOut()}>
          Sign Out
        </AuthComponentButton>
      )
    case 'loading':
      return (
        <div className="flex flex-col place-content-center text-primary">
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
