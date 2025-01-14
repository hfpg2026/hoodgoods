import Image from 'next/image'

export const BusinessCard = ({
  profilePic,
  name,
  description,
}: {
  profilePic?: string
  name: string
  description: string
}) => {
  return (
    <div className="flex gap-4 rounded-lg bg-light-brown shadow-md">
      {profilePic ? (
        <Image src={profilePic} height={24} width={24} alt={name} />
      ) : (
        <div className="p-4">
          <Image src="/assets/paperbag.svg" height={56} width={56} alt={name} />
        </div>
      )}

      <div className="flex flex-col place-content-center">
        <div className="font-bold text-dark-brown">{name}</div>
        <div className="italic text-dark-brown">{description}</div>
      </div>
    </div>
  )
}
