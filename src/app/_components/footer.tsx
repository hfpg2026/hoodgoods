import Link from 'next/link'

export const Footer = () => {
  return (
    <div className="full mt-8 flex justify-center gap-4 border-t border-accent p-4">
      <Link href="/about">About</Link>
      <a href="https://docs.google.com/document/d/1Vl7TH3NGHYDTU_q3seeHAjfAwV04cTZmQYsfXRh6dLE/edit?usp=sharing">
        Terms of Use
      </a>
      <a href="https://docs.google.com/document/d/1BZhY1SF8RaQxkWqirPGOesAN36C3wZRMqwkM2MqO5uU/edit?usp=sharing">
        Privacy Statement
      </a>
    </div>
  )
}
