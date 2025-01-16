import { type DefaultSession, type NextAuthConfig } from 'next-auth'
import credentials from 'next-auth/providers/credentials'

import { db } from '../db'

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
      // ...other properties
      // role: UserRole;
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
      name: 'Passphrase',
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
            where: (users, { eq }) => eq(users.passphrase, passphrase),
          })
          return user ?? null
        }
        return null
      },
    }),
  ],
  callbacks: {
    session: ({ session }) => ({
      ...session,
      user: {
        ...session.user,
      },
    }),
  },
} satisfies NextAuthConfig
