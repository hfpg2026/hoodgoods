export const Link = ({ href }: { href: string }) => {
  if (href.includes('instagram.com/')) {
    const username = href.split('/').pop() // 'instagram.com/username'
    return <a href={href}>📷 @{username}</a>
  }

  if (href.includes('g.co/') || href.includes('google.com/maps')) {
    return <a href={href}>📍 See on Map</a>
  }

  return <a href={href}>🔗 {href}</a>
}
