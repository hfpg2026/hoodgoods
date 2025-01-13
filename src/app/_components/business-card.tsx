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
    <div className="bg-light-brown flex gap-4 rounded-lg shadow-md">
      {profilePic ? (
        <Image src={profilePic} height={24} width={24} alt={name} />
      ) : (
        <div className="p-4">
          <Image src="/assets/paperbag.svg" height={56} width={56} alt={name} />
        </div>
      )}

      <div className="flex flex-col place-content-center">
        <div className="text-dark-brown font-bold">{name}</div>
        <div className="text-dark-brown italic">{description}</div>
      </div>
    </div>
  )
}
