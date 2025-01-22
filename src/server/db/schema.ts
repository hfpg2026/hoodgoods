import crypto from 'crypto'
import { relations, sql, type InferSelectModel } from 'drizzle-orm'
import {
  boolean,
  index,
  integer,
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
export const tags = createTable('tag', {
  id: integer('id').primaryKey().generatedByDefaultAsIdentity(),
  name: varchar('name', { length: 255 }).notNull(),
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
    logoId: integer('logo_id').references(() => uploads.id),
    ownerId: varchar('owner_id', { length: 255 })
      .notNull()
      .references(() => users.id),
    isPublished: boolean().notNull().default(false),
    createdAt: timestamp('created_at', { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).$onUpdate(
      () => new Date(),
    ),
  },
  (example) => [
    index('owner_id_idx').on(example.ownerId),
    index('name_idx').on(example.name),
    index('search_index').using(
      'gin',
      sql`${example.description} gin_trgm_ops`,
    ),
  ],
)

export const businessRelations = relations(businesses, ({ one, many }) => ({
  user: one(users, { fields: [businesses.ownerId], references: [users.id] }),
  tagsToBusinesses: many(tagsToBusinesses),
  logo: one(uploads, { fields: [businesses.logoId], references: [uploads.id] }),
  products: many(products),
}))

// ----- user -----
export const users = createTable('user', {
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
})

export const usersRelations = relations(users, ({ many }) => ({
  businessess: many(businesses),
}))
