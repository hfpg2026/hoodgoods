import NextLink from 'next/link'

export const Link = ({ href }: { href: string }) => {
  if (href.includes('instagram.com')) {
    const username = href.split('/').pop() // 'instagram.com/username'
    return <NextLink href={href}>📷 @{username}</NextLink>
  }

  if (href.includes('g.co') || href.includes('google.com/maps')) {
    return <NextLink href={href}>📍 See on Map</NextLink>
  }

  return <NextLink href={href}>🔗 {href}</NextLink>
}
