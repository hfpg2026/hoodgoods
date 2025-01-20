import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from '@/server/api/trpc'
import {
  businesses,
  businessSchema,
  tagsToBusinesses,
  type Business,
} from '@/server/db/schema'
import { and, asc, desc, eq, ilike, or, type AnyColumn } from 'drizzle-orm'
import { z } from 'zod'

const bizUpdateSchema = z.object({
  id: z.number(),
  name: z
    .string()
    .min(1, { message: 'Business name has to be at least 1 character long' }),
  description: z.string().optional(),
  story: z.string().optional(),
  links: z.string().array().optional(),
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
      await ctx.db
        .update(businesses)
        .set({ name: input.name, description: input.description })
        .where(eq(businesses.id, input.id))
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
      }),
    )
    .output(businessSchema.optional())
    .query(async ({ ctx, input }) => {
      const biz = await ctx.db.query.businesses.findFirst({
        where: eq(businesses.id, input.id),
        with: { tagsToBusinesses: { with: { tag: true } } },
      })
      return biz ? { ...biz, links: biz.links as Business['links'] } : biz
    }),
})
