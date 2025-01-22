import { eq } from 'drizzle-orm'
import { type DefaultSession, type NextAuthConfig, type User } from 'next-auth'
import credentials from 'next-auth/providers/credentials'

import { db } from '../db'
import { businesses, users } from '../db/schema'

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module 'next-auth' {
  interface Session extends DefaultSession {
    user: {
      id: string
      passphrase: string
    } & DefaultSession['user']
  }

  // interface User {
  //   // ...other properties
  //   // role: UserRole;
  // }
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authConfig = {
  providers: [
    credentials({
      id: 'passphrase',
      name: 'passphrase',
      credentials: {
        passphrase: {
          label: 'Passphrase',
          type: 'text',
          placeholder: 'Eg., correct-horse-battery-staple',
        },
      },
      async authorize({ passphrase }) {
        if (passphrase && typeof passphrase === 'string') {
          const user = await db.query.users.findFirst({
            where: eq(users.passphrase, passphrase),
          })
          return user ?? null
        }
        return null
      },
    }),
    credentials({
      id: 'register',
      name: 'new registration',
      async authorize() {
        const user = (await db.insert(users).values({}).returning()).at(0)
        // auto create biz
        if (user) {
          await db
            .insert(businesses)
            .values({ name: 'My New Business', ownerId: user.id })
        }
        return user ?? null
      },
    }),
  ],
  callbacks: {
    jwt({ user, token }) {
      if (user) {
        token.user = user
      }
      return token
    },
    session: ({ session, token }) => {
      return {
        ...session,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        user: token.user as User,
      }
    },
  },
  pages: {
    signIn: '/login',
  },
} satisfies NextAuthConfig
