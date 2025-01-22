import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from '@/server/api/trpc'
import { businesses, products, tagsToBusinesses } from '@/server/db/schema'
import { TRPCError } from '@trpc/server'
import {
  and,
  asc,
  desc,
  eq,
  getTableColumns,
  ilike,
  inArray,
  or,
  sql,
  type AnyColumn,
  type SQL,
} from 'drizzle-orm'
import { type PgTable } from 'drizzle-orm/pg-core'
import { type SQLiteTable } from 'drizzle-orm/sqlite-core'
import { z } from 'zod'

const buildConflictUpdateColumns = <
  T extends PgTable | SQLiteTable,
  Q extends keyof T['_']['columns'],
>(
  table: T,
  columns: Q[],
) => {
  const cls = getTableColumns(table)
  return columns.reduce(
    (acc, column) => {
      const colName = cls[column]?.name
      acc[column] = sql.raw(`excluded.${colName}`)
      return acc
    },
    {} as Record<Q, SQL>,
  )
}

const productSchema = z.object({
  id: z.number().optional(),
  name: z.string(),
  description: z.string().nullish(),
  imageId: z.number().nullish(),
})
export type Product = z.infer<typeof productSchema>

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
  products: productSchema.array().default([]),
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
  tags: z.number().array().default([]),
  logoId: z.number().optional(),
  products: productSchema.array().default([]),
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

        // delete tags
        await tx
          .delete(tagsToBusinesses)
          .where(eq(tagsToBusinesses.businessId, input.id))
        // set new tags
        if (input.tags.length) {
          await tx
            .insert(tagsToBusinesses)
            .values(input.tags.map((t) => ({ businessId: input.id, tagId: t })))
        }

        // delete removed products
        const currentProducts = await tx
          .select({ id: products.id })
          .from(products)
          .where(eq(products.businessId, input.id))
        const inputProductIds = input.products.map((p) => p.id)
        const idsToDelete = currentProducts
          .filter((cp) => !inputProductIds.includes(cp.id))
          .map((cp) => cp.id)
        // delete products
        await tx.delete(products).where(inArray(products.id, idsToDelete))

        // upsert products
        if (input.products.length) {
          await tx
            .insert(products)
            .values(input.products.map((p) => ({ ...p, businessId: input.id })))
            .onConflictDoUpdate({
              target: products.id,
              set: {
                ...buildConflictUpdateColumns(products, [
                  'name',
                  'description',
                  'imageId',
                  'businessId',
                ]),
              },
            })
        }
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
