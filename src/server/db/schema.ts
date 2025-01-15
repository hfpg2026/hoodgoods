import crypto from 'crypto'
import { relations, sql } from 'drizzle-orm'
import {
  index,
  integer,
  pgTableCreator,
  primaryKey,
  text,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core'

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = pgTableCreator((name) => name)

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
  (tb) => ({
    pk: primaryKey({ columns: [tb.tagId, tb.businessId] }),
  }),
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

// ----- business ------
export const businesses = createTable(
  'business',
  {
    id: integer('id').primaryKey().generatedByDefaultAsIdentity(),
    name: varchar('name', { length: 255 }).notNull(),
    description: text('description'),
    ownerId: varchar('owner_id', { length: 255 })
      .notNull()
      .references(() => users.id),
    createdAt: timestamp('created_at', { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).$onUpdate(
      () => new Date(),
    ),
  },
  (example) => ({
    ownerIdIdx: index('owner_id_idx').on(example.ownerId),
    nameIndex: index('name_idx').on(example.name),
  }),
)

export const businessRelations = relations(businesses, ({ one, many }) => ({
  user: one(users, { fields: [businesses.ownerId], references: [users.id] }),
  tagsToBusinesses: many(tagsToBusinesses),
}))

// ----- user -----
export const users = createTable('user', {
  id: varchar('id', { length: 255 })
    .notNull()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  phone: varchar('phone', { length: 255 }).unique(),
  createdAt: timestamp('created_at', { withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
})

export const usersRelations = relations(users, ({ many }) => ({
  businessess: many(businesses),
}))
