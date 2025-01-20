export const Link = ({ href }: { href: string }) => {
  try {
    const url = new URL(href);
    if (url.hostname === 'instagram.com') {
      const username = url.pathname.split('/').pop(); // 'instagram.com/username'
      return <a href={href}>📷 @{username}</a>
    }

    if (url.hostname === 'g.co' || url.hostname === 'google.com' && url.pathname.startsWith('/maps')) {
      return <a href={href}>📍 See on Map</a>
    }
  } catch (e) {
    // Handle invalid URL
    console.error('Invalid URL:', href);
  }

  return <a href={href}>🔗 {href}</a>
}
