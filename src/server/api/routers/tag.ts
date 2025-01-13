import { createTRPCRouter, publicProcedure } from '@/server/api/trpc'
import z from 'zod'

export const tagRouter = createTRPCRouter({
  getAll: publicProcedure
    .output(z.object({ name: z.string() }).array())
    .query(async ({ ctx }) => {
      return await ctx.db.query.tags.findMany()
    }),
})
