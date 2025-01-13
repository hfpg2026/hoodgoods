import { createTRPCRouter, protectedProcedure } from '@/server/api/trpc'
import { businesses } from '@/server/db/schema'
import { z } from 'zod'

export const businessRouter = createTRPCRouter({
  create: protectedProcedure
    .input(z.object({ name: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.insert(businesses).values({
        name: input.name,
        ownerId: ctx.session.user.id,
      })
    }),
})
