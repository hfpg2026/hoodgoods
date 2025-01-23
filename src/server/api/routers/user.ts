import { users } from '@/server/db/schema'
import { eq } from 'drizzle-orm'
import z from 'zod'

import { createTRPCRouter, protectedProcedure } from '../trpc'

export const userRouter = createTRPCRouter({
  getMyself: protectedProcedure
    .output(z.object({ passphrase: z.string() }).optional())
    .query(async ({ ctx }) => {
      return await ctx.db.query.users.findFirst({
        where: eq(users.id, ctx.session.user.id),
      })
    }),
})
