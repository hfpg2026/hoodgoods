import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from '@/server/api/trpc'
import { businesses } from '@/server/db/schema'
import { asc, desc, ilike, or, sql, type AnyColumn } from 'drizzle-orm'
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

  find: publicProcedure
    .input(
      z.object({
        orderKey: z.enum(['createdAt']),
        order: z.enum(['asc', 'desc']),
        limit: z.number().default(10),
        page: z.number().default(1),
        searchTerm: z.string().optional(),
      }),
    )
    .output(
      z
        .object({
          id: z.number(),
          name: z.string(),
          description: z.string().nullable(),
        })
        .array(),
    )
    .query(async ({ ctx, input }) => {
      const orderFn = input.order === 'asc' ? asc : desc
      const orderColMap: Record<(typeof input)['orderKey'], AnyColumn> = {
        createdAt: businesses.createdAt,
      }

      return await ctx.db
        .select()
        .from(businesses)
        .where(
          input.searchTerm
            ? or(
                ilike(businesses.description, `%${input.searchTerm}%`),
                ilike(businesses.name, `%${input.searchTerm}%`),
              )
            : undefined,
        )
        .orderBy(orderFn(orderColMap[input.orderKey]))
        .limit(input.limit)
        .offset((input.page - 1) * input.limit)
    }),
})
