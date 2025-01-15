import { createTRPCRouter, publicProcedure } from '@/server/api/trpc'
import { tags } from '@/server/db/schema'
import { asc } from 'drizzle-orm'
import z from 'zod'

export const tagRouter = createTRPCRouter({
  findAll: publicProcedure
    .output(z.object({ id: z.number(), name: z.string() }).array())
    .query(async ({ ctx }) => {
      return await ctx.db.query.tags.findMany({
        orderBy: [asc(tags.id)],
      })
    }),
})
