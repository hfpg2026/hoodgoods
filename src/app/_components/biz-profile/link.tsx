export const Link = ({ href }: { href: string }) => {
  try {
    const url = new URL(href)
    if (url.hostname === 'instagram.com') {
      const username = url.pathname.split('/').pop() // 'instagram.com/username'
      return (
        <a target="_blank" href={href}>
          📷 @{username}
        </a>
      )
    }

    if (url.hostname === 'take.app') {
      const username = url.pathname.split('/').pop() // 'take.app/username'
      return (
        <a target="_blank" href={href} className="hover:underline">
          🛒 {username}
        </a>
      )
    }

    if (url.hostname === 'tiktok.com') {
      const username = url.pathname.split('/').pop() // 'tiktok.com/@username'
      return (
        <a target="_blank" href={href} className="hover:underline">
          📹 {username}
        </a>
      )
    }

    if (
      url.hostname === 'g.co' ||
      (url.hostname === 'google.com' && url.pathname.startsWith('/maps'))
    ) {
      return (
        <a target="_blank" href={href}>
          📍 See on Map
        </a>
      )
    }

    return (
      <a target="_blank" href={href}>
        🔗 {href}
      </a>
    )
  } catch (e) {
    console.error('Invalid URL:', href, e)
  }
}
