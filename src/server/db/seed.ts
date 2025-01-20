import { exit } from 'process'
import * as schema from '@/server/db/schema'
import { drizzle } from 'drizzle-orm/node-postgres'
import { reset } from 'drizzle-seed'

async function main() {
  try {
    const db = drizzle(process.env.DATABASE_URL!)
    console.log('resetting db')
    await reset(db, schema)

    // create user
    console.log('creating user')
    const user = await db
      .insert(schema.users)
      .values([{ passphrase: 'correct-battery-horse-staple' }])
      .returning()
    const ownerId = user[0]!.id

    // create tags
    console.log('creating tags')
    await db
      .insert(schema.tags)
      .values([
        { name: '🍔 Food & Beverages' },
        { name: '💄 Beauty' },
        { name: '🧵 Handmade Items' },
        { name: '🏋️‍♀️ Fitness' },
        { name: '💼 Services' },
      ])

    // create biz
    console.log('creating biz')
    await db.insert(schema.businesses).values([
      {
        name: 'coffee biz',
        description: 'fragrant cups of coffee',
        ownerId,
      },
      {
        name: 'tea biz',
        description: 'calming cups of tea',
        ownerId,
      },
    ])
  } catch (e) {
    console.error(e)
  }

  exit(0)
}

void main()
