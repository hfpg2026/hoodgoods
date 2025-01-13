import { createTRPCRouter, protectedProcedure } from '@/server/api/trpc'
import { users } from '@/server/db/schema'
import { z } from 'zod'

export const userRouter = createTRPCRouter({
  create: protectedProcedure
    .input(z.object({ phone: z.string().min(8) }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.insert(users).values({
        phone: input.phone,
      })
    }),
})
