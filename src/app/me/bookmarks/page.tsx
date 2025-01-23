import { BusinessCard } from '@/app/_components/business-card'
import { Navbar } from '@/app/_components/navbar'
import { Searchbar } from '@/app/_components/searchbar'
import { api } from '@/trpc/server'

export default async function Bookmarks() {
  const bookmarks = await api.bookmark.getUserBookmarks()

  return (
    <main className="flex min-h-screen w-full flex-col gap-2 pb-6 pt-2">
      <Navbar showSearch={false} />

      {/* businessess */}
      <div className="flex w-full place-content-center pt-4">
        <div className="flex w-9/12 flex-col gap-4">
          {bookmarks.length === 0 && (
            <div className="flex flex-col gap-4 text-center">
              <div>
                You currently do not have any bookmarks. Start browsing and
                saving businesses to see them here!
              </div>
              <Searchbar />
            </div>
          )}
          {bookmarks.map(({ business: b }) => (
            <BusinessCard
              key={b.id}
              id={b.id}
              name={b.name}
              description={b.description ?? ''}
            />
          ))}
        </div>
      </div>
    </main>
  )
}
