import Image from 'next/image'

import { NavMenu } from '../_components/nav-menu'

export default async function About() {
  return (
    <main className="flex h-full min-h-screen w-full flex-col gap-2 bg-background px-2 pb-6 pt-3">
      <div className="flex w-full items-center justify-end px-6">
        <NavMenu />
      </div>
      <div className="flex w-full place-content-center">
        <Image
          src="/assets/logo-rainbow.svg"
          width={720}
          height={200}
          alt="Hood Goods"
          priority
        />
      </div>
      <div className="flex w-full place-content-center">
        <div className="mx-4 flex w-full flex-col gap-4 md:w-6/12">
          <p>
            <b>Welcome to HoodGoods!</b> HoodGoods is an online platform
            developed by a team from Open Government Products (OGP) and the
            Ministry of Digital Development and Information (MDDI) as part of
            Hack for Public Good 2025, to connect consumers with home-based
            businesses in Singapore.
          </p>
          <p>
            We&apos;re trying something new here! This platform is in a test
            phase, which means:
          </p>
          <ul className="flex flex-col gap-1">
            <li>We&apos;re seeing if this idea works for our community</li>
            <li>The platform might not be permanent</li>
            <li>
              We&apos;ll let you know well in advance on this site itself if we
              decide to wrap things up
            </li>
            <li>
              If we do end the pilot, your saved information might not stick
              around (so you are encouraged to follow your favorite home-based
              businesses on social media)
            </li>
          </ul>
          <p></p>
          <p>
            <b>How This Works</b>
          </p>
          <p>
            Our platform serves as a directory where home-based business owners
            can list their offerings, making it easier for customers to discover
            them. While we provide this valuable connection between businesses
            and consumers, we do not endorse any listed businesses or their
            products and services. All businesses are presented equally on our
            platform, with no preferential treatment or promotional advantages
            given to any particular listing. Businesses are only shown by the
            categories by services/products offered, by location, or by date
            onboarded onto Hoodgoods.
          </p>
          <p>
            We encourage you to conduct your own research, read reviews when
            available, and make informed decisions when choosing to support any
            business found through our site. The responsibility for verifying
            business credentials, quality of services, and ensuring satisfactory
            transactions lies between you and the business owner. Our role is
            simple: creating the space for discovery. The rest is up to you and
            the wonderful hustlers who make up our vibrant community of
            home-based businesses.
          </p>
        </div>
      </div>
    </main>
  )
}
