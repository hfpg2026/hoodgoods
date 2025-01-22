import { generatePutObjectUrl, getObjectUrl } from '@/lib/s3'
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from '@/server/api/trpc'
import { businesses, uploads } from '@/server/db/schema'
import { TRPCError } from '@trpc/server'
import { and, eq } from 'drizzle-orm'
import z from 'zod'

export const uploadRouter = createTRPCRouter({
  generatePresignedUrl: protectedProcedure
    .input(z.object({ s3ObjectKey: z.string() }))
    .output(z.object({ url: z.string() }))
    .mutation(async ({ input }) => {
      const url = await generatePutObjectUrl(input.s3ObjectKey)
      return { url }
    }),

  upload: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        sizeInBytes: z.number(),
        s3ObjectKey: z.string(),
        businessId: z.number(),
      }),
    )
    .output(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      // safety check biz belongs to owner
      const biz = await ctx.db.query.businesses.findFirst({
        where: and(
          eq(businesses.id, input.businessId),
          eq(businesses.ownerId, ctx.session.user.id),
        ),
      })
      if (!biz) throw new TRPCError({ code: 'NOT_FOUND' })

      return (
        await ctx.db
          .insert(uploads)
          .values({ ...input })
          .returning({ id: uploads.id })
      )[0]!
    }),

  get: publicProcedure
    .input(z.object({ id: z.number(), businessId: z.number() }))
    .output(z.object({ url: z.string() }))
    .query(async ({ ctx, input }) => {
      const upload = await ctx.db.query.uploads.findFirst({
        where: eq(uploads.id, input.id),
      })
      if (!upload) throw new TRPCError({ code: 'NOT_FOUND' })
      const url = await getObjectUrl(upload.s3ObjectKey)
      return { url }
    }),
})
