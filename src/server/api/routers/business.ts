import crypto from 'node:crypto'
import { resourceLimits } from 'node:worker_threads'
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from '@/server/api/trpc'
import { db } from '@/server/db'
import {
  businesses,
  businessImages,
  products,
  tagsToBusinesses,
} from '@/server/db/schema'
import { TRPCError } from '@trpc/server'
import {
  and,
  asc,
  count,
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

import { getNearestMrt, postalCodeToSvy21 } from '../onemap'

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
  isPublished: z.boolean(),
  name: z.string(),
  description: z.string().nullable(),
  story: z.string().nullable(),
  links: z.string().array(),
  ownerId: z.string(),
  tagsToBusinesses: z // relations
    .object({ tag: z.object({ id: z.number(), name: z.string() }) })
    .array()
    .default([]),
  businessImages: z.object({ uploadId: z.number() }).array().default([]),
  products: productSchema.array().default([]),
  postalCode: z.string().regex(/\d{6}/).nullable(),
  svy21X: z.coerce.string().nullable(),
  svy21Y: z.coerce.string().nullable(),
  nearestMrt: z.string().nullable(),
  nearestMrtDistance: z.coerce.string().nullable(),
})
export type Business = z.infer<typeof businessSelectSchema>

const bizUpdateSchema = z.object({
  id: z.number(),
  isPublished: z.boolean(),
  name: z
    .string()
    .min(1, { message: 'Business name has to be at least 1 character long' }),
  description: z.string().optional(),
  story: z.string().optional(),
  links: z.string().url().array().optional(),
  tags: z.number().array().default([]),
  products: productSchema.array().default([]),
  images: z.number().array().default([]),
  postalCode: z.string().regex(/\d{6}/),
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

        const { x, y } = await postalCodeToSvy21(input.postalCode)
        const { nearestMrt, dist } = getNearestMrt({ x, y })
        await tx
          .update(businesses)
          .set({
            name: input.name,
            description: input.description,
            story: input.story,
            links: input.links,
            postalCode: input.postalCode,
            svy21X: (
              Number(x) +
              crypto.randomInt(-50000, 50000) / 10000
            ).toString(),
            svy21Y: (
              Number(y) +
              crypto.randomInt(-50000, 50000) / 10000
            ).toString(),
            nearestMrt,
            nearestMrtDistance: dist.toFixed(3).toString(),
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

        // profile images
        await tx
          .delete(businessImages)
          .where(eq(businessImages.businessId, input.id))
        // set new images
        if (input.images.length) {
          await tx
            .insert(businessImages)
            .values(
              input.images.map((i) => ({ businessId: input.id, uploadId: i })),
            )
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
        postalCode: z.string().regex(/\d{6}/).optional(),
        tags: z
          .string()
          .transform((x) => Number(x))
          .array()
          .optional(),
      }),
    )
    .output(
      z.object({
        totalCount: z.number(),
        businesses: businessSelectSchema.array().default([]),
      }),
    )
    .query(async ({ ctx, input }) => {
      const orderFn = input.order === 'asc' ? asc : desc
      const orderColMap: Record<(typeof input)['orderKey'], AnyColumn> = {
        createdAt: businesses.createdAt,
      }
      const { x, y } = input.postalCode
        ? await postalCodeToSvy21(input.postalCode)
        : { x: '1000000', y: '10000000' }

      const where = and(
        // search term
        input.searchTerm
          ? or(
              ilike(businesses.description, `%${input.searchTerm}%`),
              ilike(businesses.name, `%${input.searchTerm}%`),
            )
          : undefined,
        // tag
        input.tags && input.tags.length > 0
          ? inArray(
              businesses.id,
              ctx.db
                .select({ id: tagsToBusinesses.businessId })
                .from(tagsToBusinesses)
                .where(inArray(tagsToBusinesses.tagId, input.tags)),
            )
          : undefined,
        eq(businesses.isPublished, true),
      )

      const [countResult] = await ctx.db
        .select({ totalCount: count() })
        .from(businesses)
        .where(where)

      const result = await ctx.db.query.businesses.findMany({
        where,
        extras: {
          nearestDistance:
            sql<number>`SQRT(POW(${businesses.svy21X} - ${x}, 2) + POW(${businesses.svy21Y}  - ${y}, 2))`.as(
              'nearest_distance',
            ),
        },
        with: {
          businessImages: { limit: 1 },
        },
        orderBy: input.postalCode
          ? sql`nearest_distance asc nulls last`
          : orderFn(orderColMap[input.orderKey]),
        limit: input.limit,
        offset: (input.page - 1) * input.limit,
      })

      return {
        totalCount: countResult?.totalCount ?? result.length,
        businesses: result.map((b) => ({ ...b, postalCode: null })),
      }
    }),

  get: publicProcedure
    .input(
      z.object({
        id: z.string().transform((x) => Number(x)),
        isEdit: z.boolean().optional(),
      }),
    )
    .output(businessSelectSchema.optional())
    .query(async ({ ctx, input }) => {
      if (input.isEdit && !ctx.session?.user.id) {
        throw new TRPCError({ code: 'UNAUTHORIZED' })
      }

      const biz = await ctx.db.query.businesses.findFirst({
        where: and(
          eq(businesses.id, input.id),
          or(
            (ctx.session && eq(businesses.ownerId, ctx.session.user.id)) ??
              undefined,
            input.isEdit ? undefined : eq(businesses.isPublished, true),
          ),
        ),
        with: {
          tagsToBusinesses: { with: { tag: true } },
          products: true,
          businessImages: true,
        },
      })
      if (biz && ctx.session?.user.id !== biz.ownerId) {
        biz.postalCode = null
      }
      return biz
    }),

  getMyBiz: publicProcedure
    .output(z.object({ id: z.number().optional() }))
    .query(async ({ ctx }) => {
      if (ctx.session?.user.id) {
        const biz = await ctx.db.query.businesses.findFirst({
          where: eq(businesses.ownerId, ctx.session.user.id),
          columns: { id: true },
        })
        return biz ?? {}
      }
      return {}
    }),
})
