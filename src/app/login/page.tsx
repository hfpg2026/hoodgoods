'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { signIn } from 'next-auth/react'

import { NavMenu } from '../_components/nav-menu'

export default function Login() {
  const [passphrase, setPassphrase] = useState('')
  return (
    <main className="flex min-h-screen w-full flex-col gap-6 bg-background pb-6 pt-2">
      <div className="flex w-full items-center justify-end px-6">
        <NavMenu />
      </div>

      <div className="flex w-full place-content-center">
        <Image
          src="/assets/logo-lg.svg"
          width={200}
          height={200}
          alt="Hood Goods"
          priority
        />
      </div>

      <div className="flex w-full place-content-center">
        <div className="flex flex-col gap-2 sm:w-9/12 md:w-6/12">
          <Label>Secret Code</Label>
          <Input
            value={passphrase}
            onChange={(e) => setPassphrase(e.target.value)}
            placeholder="correct-horse-battery-staple"
          />
          <Button
            onClick={() =>
              signIn('passphrase', { passphrase, redirectTo: '/' })
            }
          >
            Login ➡
          </Button>
          <Button
            variant="ghost"
            onClick={() => signIn('register', { redirectTo: '/me/code' })}
          >
            Create New Account
          </Button>
        </div>
      </div>
    </main>
  )
}
