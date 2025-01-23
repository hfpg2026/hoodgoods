'use client'

import Image from 'next/image'
import { Navbar } from '@/app/_components/navbar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useSession } from 'next-auth/react'

export default function Code() {
  const session = useSession()

  if (session.status !== 'authenticated') return <></>

  return (
    <main className="flex min-h-screen w-full flex-col gap-6 bg-background pb-6 pt-2">
      <Navbar showSearch={false} />

      <div className="flex w-full place-content-center">
        <Image
          src="/assets/logo-lg.svg"
          width={200}
          height={200}
          alt="Hood Goods"
          priority
        />
      </div>

      <div className="flex max-w-screen-sm self-center">
        <div className="flex flex-col gap-4 text-center">
          <div>
            Hi there! This is the <b>secret code</b> you can use to log back
            into Hood Goods. Please save it somewhere safe.
          </div>
          <div className="flex justify-center gap-2">
            <Input readOnly value={session.data.user.passphrase} />
            <Button
              onClick={() =>
                navigator.clipboard.writeText(session.data.user.passphrase)
              }
            >
              💾 Copy
            </Button>
          </div>
        </div>
      </div>
    </main>
  )
}
