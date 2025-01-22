import { createTRPCRouter, protectedProcedure } from '@/server/api/trpc'
import { businesses, products } from '@/server/db/schema'
import { TRPCError } from '@trpc/server'
import { and, eq } from 'drizzle-orm'
import z from 'zod'

const productCreateSchema = z.object({
  businessId: z.number(),
  name: z.string(),
  description: z.string().optional(),
  imageId: z.number().optional(),
})
const productUpdateSchema = productCreateSchema.extend({ id: z.number() })
export type ProductUpdateType = z.infer<typeof productCreateSchema>

export const productSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string().nullable(),
  imageId: z.number().nullable(),
})

export type Product = z.infer<typeof productSchema>

export const productRouter = createTRPCRouter({
  create: protectedProcedure
    .input(productCreateSchema)
    .output(productSchema)
    .mutation(async ({ ctx, input }) => {
      // safety check that biz belongs to user
      const biz = await ctx.db.query.businesses.findFirst({
        where: and(
          eq(businesses.ownerId, ctx.session.user.id),
          eq(businesses.id, input.businessId),
        ),
      })
      if (!biz) throw new TRPCError({ code: 'NOT_FOUND' })

      return (
        await ctx.db
          .insert(products)
          .values({ ...input })
          .returning()
      )[0]!
    }),

  update: protectedProcedure
    .input(productUpdateSchema)
    .output(productSchema)
    .mutation(async ({ ctx, input }) => {
      // safety check that biz belongs to user
      const biz = await ctx.db.query.businesses.findFirst({
        where: and(
          eq(businesses.ownerId, ctx.session.user.id),
          eq(businesses.id, input.businessId),
        ),
      })
      if (!biz) throw new TRPCError({ code: 'NOT_FOUND' })
      return (
        await ctx.db
          .update(products)
          .set({ ...input })
          .where(eq(products.id, input.id))
          .returning()
      )[0]!
    }),
})
