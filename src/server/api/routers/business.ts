import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from '@/server/api/trpc'
import { businesses, tagsToBusinesses } from '@/server/db/schema'
import { TRPCError } from '@trpc/server'
import { and, asc, desc, eq, ilike, or, type AnyColumn } from 'drizzle-orm'
import { z } from 'zod'

export const businessSelectSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string().nullable(),
  story: z.string().nullable(),
  links: z.string().array(),
  ownerId: z.string().optional(),
  tagsToBusinesses: z // relations
    .object({ tag: z.object({ id: z.number(), name: z.string() }) })
    .array()
    .default([]),
  logoId: z.number().nullable(),
  products: z
    .object({
      name: z.string(),
      description: z.string().nullable(),
      imageId: z.number().nullable(),
    })
    .array()
    .default([]),
})
export type Business = z.infer<typeof businessSelectSchema>

const bizUpdateSchema = z.object({
  id: z.number(),
  name: z
    .string()
    .min(1, { message: 'Business name has to be at least 1 character long' }),
  description: z.string().optional(),
  story: z.string().optional(),
  links: z.string().url().array().optional(),
  tags: z.number().array().optional(),
})
export type BizUpdateType = z.infer<typeof bizUpdateSchema>

export const businessRouter = createTRPCRouter({
  create: protectedProcedure
    .input(z.object({ name: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.insert(businesses).values({
        name: input.name,
        ownerId: ctx.session.user.id,
      })
    }),

  update: protectedProcedure
    .input(bizUpdateSchema)
    .mutation(async ({ ctx, input }) => {
      await ctx.db.transaction(async (tx) => {
        // safety check ownerId = userId
        const biz = await tx
          .select()
          .from(businesses)
          .where(
            and(
              eq(businesses.id, input.id),
              eq(businesses.ownerId, ctx.session.user.id),
            ),
          )
        if (biz.length === 0) {
          throw new TRPCError({
            message: 'Business not found',
            code: 'NOT_FOUND',
          })
        }

        await tx
          .update(businesses)
          .set({
            name: input.name,
            description: input.description,
            story: input.story,
            links: input.links,
          })
          .where(eq(businesses.id, input.id))

        // delete removed tags
        await tx
          .delete(tagsToBusinesses)
          .where(eq(tagsToBusinesses.businessId, input.id))
        // set new tags
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
        tag: z
          .string()
          .optional()
          .transform((x) => Number(x)),
      }),
    )
    .output(
      z
        .object({
          business: z.object({
            id: z.number(),
            name: z.string(),
            description: z.string().nullable(),
          }),
        })
        .array(),
    )
    .query(async ({ ctx, input }) => {
      const orderFn = input.order === 'asc' ? asc : desc
      const orderColMap: Record<(typeof input)['orderKey'], AnyColumn> = {
        createdAt: businesses.createdAt,
      }

      const query = ctx.db
        .select()
        .from(businesses)
        .where(
          and(
            // search term
            input.searchTerm
              ? or(
                  ilike(businesses.description, `%${input.searchTerm}%`),
                  ilike(businesses.name, `%${input.searchTerm}%`),
                )
              : undefined,
            // tag
            input.tag ? eq(tagsToBusinesses.tagId, input.tag) : undefined,
          ),
        )
        .orderBy(orderFn(orderColMap[input.orderKey]))
        .limit(input.limit)
        .offset((input.page - 1) * input.limit)
        .$dynamic()

      if (input.tag) {
        return await query.innerJoin(
          tagsToBusinesses,
          eq(tagsToBusinesses.businessId, businesses.id),
        )
      }

      // left join to keep data structure constant
      return await query.leftJoin(
        tagsToBusinesses,
        eq(tagsToBusinesses.businessId, businesses.id),
      )
    }),

  get: publicProcedure
    .input(
      z.object({
        id: z.string().transform((x) => Number(x)),
        ownerId: z.string().optional(),
      }),
    )
    .output(businessSelectSchema.optional())
    .query(async ({ ctx, input }) => {
      const biz = await ctx.db.query.businesses.findFirst({
        where: and(
          eq(businesses.id, input.id),
          input.ownerId ? eq(businesses.ownerId, input.ownerId) : undefined,
        ),
        with: { tagsToBusinesses: { with: { tag: true } }, products: true },
      })
      return biz
    }),
})
