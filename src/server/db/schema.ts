import crypto from 'crypto'
import { relations, sql, type InferSelectModel } from 'drizzle-orm'
import {
  boolean,
  decimal,
  index,
  integer,
  pgEnum,
  pgTableCreator,
  primaryKey,
  text,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core'
import { generatePassphrase } from 'niceware'

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = pgTableCreator((name) => name)

// ----- bookmarks -----
export const bookmarks = createTable(
  'bookmarks',
  {
    userId: varchar('user_id', { length: 255 })
      .references(() => users.id)
      .notNull(),
    businessId: integer('business_id')
      .references(() => businesses.id)
      .notNull(),
    createdAt: timestamp('created_at', { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
  },
  (b) => [
    primaryKey({ columns: [b.userId, b.businessId] }),
    index('business_id_id').on(b.businessId),
  ],
)

export const bookmarksRelations = relations(bookmarks, ({ one }) => {
  return {
    business: one(businesses, {
      fields: [bookmarks.businessId],
      references: [businesses.id],
    }),
  }
})

// ----- biz images -----
export const businessImages = createTable(
  'business_images',
  {
    uploadId: integer('upload_id')
      .references(() => uploads.id)
      .notNull(),
    businessId: integer('business_id')
      .references(() => businesses.id)
      .notNull(),
  },
  (b) => [
    primaryKey({ columns: [b.uploadId, b.businessId] }),
    index('business_images_id_idx').on(b.businessId),
  ],
)

export const businessImagesRelations = relations(businessImages, ({ one }) => {
  return {
    business: one(businesses, {
      fields: [businessImages.businessId],
      references: [businesses.id],
    }),
  }
})

// ----- uploads -----
export const uploads = createTable('uploads', {
  id: integer('id').primaryKey().generatedByDefaultAsIdentity(),
  name: varchar('name', { length: 255 }).notNull(),
  sizeInBytes: integer('sizeInBytes').notNull(),
  s3ObjectKey: text('s3ObjectKey').notNull(),
  userId: varchar('user_id', { length: 255 })
    .references(() => users.id)
    .notNull(),
  createdAt: timestamp('created_at', { withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
})

export type Upload = InferSelectModel<typeof uploads>

// ----- product -----
export const products = createTable(
  'product',
  {
    id: integer('id').primaryKey().generatedByDefaultAsIdentity(),
    name: varchar('name', { length: 255 }).notNull(),
    description: text('descripiton'),
    imageId: integer('image_id').references(() => uploads.id),
    businessId: integer('business_id')
      .notNull()
      .references(() => businesses.id),
  },
  (p) => [index('business_id_idx').on(p.businessId)],
)

export const productsRelations = relations(products, ({ one }) => {
  return {
    image: one(uploads, {
      fields: [products.imageId],
      references: [uploads.id],
    }),
    business: one(businesses, {
      fields: [products.businessId],
      references: [businesses.id],
    }),
  }
})

// ----- tag -----
export const tagType = pgEnum('type', ['category', 'tag'])
export const tags = createTable('tag', {
  id: integer('id').primaryKey().generatedByDefaultAsIdentity(),
  name: varchar('name', { length: 255 }).notNull(),
  type: tagType().notNull().default('tag'),
})

export const tagsRelations = relations(tags, ({ many }) => ({
  tagsToBusinesses: many(tagsToBusinesses),
}))

export const tagsToBusinesses = createTable(
  'tag_business',
  {
    tagId: integer('tag_id')
      .notNull()
      .references(() => tags.id),
    businessId: integer('business_id')
      .notNull()
      .references(() => businesses.id),
  },
  (tb) => [primaryKey({ columns: [tb.tagId, tb.businessId] })],
)

export const tagsToBusinessesRelations = relations(
  tagsToBusinesses,
  ({ one }) => ({
    tag: one(tags, {
      fields: [tagsToBusinesses.tagId],
      references: [tags.id],
    }),
    business: one(businesses, {
      fields: [tagsToBusinesses.businessId],
      references: [businesses.id],
    }),
  }),
)

export type Tag = InferSelectModel<typeof tags>

// ----- business ------
export const businesses = createTable(
  'business',
  {
    id: integer('id').primaryKey().generatedByDefaultAsIdentity(),
    name: varchar('name', { length: 255 }).notNull(),
    description: text('description'),
    links: text('links')
      .array()
      .notNull()
      .default(sql`'{}'::text[]`),
    story: text('story'),
    ownerId: varchar('owner_id', { length: 255 })
      .notNull()
      .references(() => users.id),
    // the postal code where the business is. shown only to the business owner.
    postalCode: text('postal_code'),
    // svy21 values contain cartesian coordinates derived from the postal code,
    // with a small amount of jitter (0-5m) to mask the true location of the business
    svy21X: decimal('svy21_x'),
    svy21Y: decimal('svy21_y'),
    nearestMrt: text('nearest_mrt'),
    nearestMrtDistance: decimal('nearest_mrt_distance'),
    isPublished: boolean().notNull().default(false),
    createdAt: timestamp('created_at', { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).$onUpdate(
      () => new Date(),
    ),
  },
  (biz) => [
    index('owner_id_idx').on(biz.ownerId),
    index('name_idx').on(biz.name),
    index('search_index').using('gin', sql`${biz.description} gin_trgm_ops`),
    index('is_published_idx').on(biz.isPublished),
  ],
)

export const businessRelations = relations(businesses, ({ one, many }) => ({
  user: one(users, { fields: [businesses.ownerId], references: [users.id] }),
  tagsToBusinesses: many(tagsToBusinesses),
  products: many(products),
  businessImages: many(businessImages),
}))

// ----- user -----
export const users = createTable(
  'user',
  {
    id: varchar('id', { length: 255 })
      .notNull()
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    passphrase: varchar('passphrase', { length: 255 })
      .notNull()
      .$defaultFn(() => generatePassphrase(8).join('-')),
    /* Used for binding to Singpass. Mandatory for biz owners */
    sgid: varchar('sgid', { length: 127 }).unique(),
    phone: varchar('phone', { length: 255 }).unique(),
    createdAt: timestamp('created_at', { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
  },
  (u) => [index('passphrase_idx').on(u.passphrase)],
)

export const usersRelations = relations(users, ({ many }) => ({
  businessess: many(businesses),
}))
