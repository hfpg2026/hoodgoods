import { createTRPCRouter, publicProcedure } from '@/server/api/trpc'
import { tags } from '@/server/db/schema'
import { asc, eq } from 'drizzle-orm'
import z from 'zod'

const tagTypeEnums = z.enum(['category', 'tag'])

export const tagRouter = createTRPCRouter({
  findAll: publicProcedure
    .input(z.object({ type: tagTypeEnums.optional() }).optional())
    .output(
      z
        .object({
          id: z.number(),
          name: z.string(),
          type: tagTypeEnums,
        })
        .array(),
    )
    .query(async ({ ctx, input }) => {
      return await ctx.db.query.tags.findMany({
        where: input?.type ? eq(tags.type, input.type) : undefined,
        orderBy: [asc(tags.id)],
      })
    }),
})
