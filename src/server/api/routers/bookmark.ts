import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from '@/server/api/trpc'
import { db } from '@/server/db'
import { bookmarks } from '@/server/db/schema'
import { and, count, eq } from 'drizzle-orm'
import z from 'zod'

import { businessSelectSchema } from './business'

export const bookmarkRouter = createTRPCRouter({
  getForBiz: publicProcedure
    .input(z.object({ businessId: z.number() }))
    .output(
      z.object({ total: z.number().default(0), isUserBookmark: z.boolean() }),
    )
    .query(async ({ ctx, input }) => {
      const totalCount = await db
        .select({ count: count() })
        .from(bookmarks)
        .where(eq(bookmarks.businessId, input.businessId))

      let isUserBookmark = false
      if (ctx.session?.user.id) {
        const userBookmark = await db.query.bookmarks.findFirst({
          where: and(
            eq(bookmarks.userId, ctx.session.user.id),
            eq(bookmarks.businessId, input.businessId),
          ),
        })
        isUserBookmark = !!userBookmark
      }
      return { count: totalCount[0]?.count, isUserBookmark }
    }),

  create: protectedProcedure
    .input(z.object({ id: z.number() }))
    .output(z.object({ isInsert: z.boolean() }))
    .mutation(async ({ ctx, input }) => {
      const res = await ctx.db
        .insert(bookmarks)
        .values({ businessId: input.id, userId: ctx.session.user.id })
        .onConflictDoNothing({
          target: [bookmarks.userId, bookmarks.businessId],
        })
      return { isInsert: res.length === 0 }
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.number() }))
    .output(z.object({ isDelete: z.boolean() }))
    .mutation(async ({ ctx, input }) => {
      const res = await ctx.db
        .delete(bookmarks)
        .where(
          and(
            eq(bookmarks.userId, ctx.session.user.id),
            eq(bookmarks.businessId, input.id),
          ),
        )
      return { isDelete: res.length === 0 }
    }),

  getUserBookmarks: protectedProcedure
    .output(z.object({ business: businessSelectSchema }).array())
    .query(async ({ ctx }) => {
      return await ctx.db.query.bookmarks.findMany({
        where: eq(bookmarks.userId, ctx.session.user.id),
        with: { business: true },
      })
    }),
})
