import Image from 'next/image'

export const ProductCard = ({
  img,
  name,
  description,
}: {
  img: string
  name: string
  description: string
}) => {
  return (
    <div className="flex h-full flex-col gap-2 rounded-lg bg-accent p-4 shadow-md">
      <div className="grow-1 self-center">
        <Image src={img} alt={name} width={200} height={200} />
      </div>
      <div className="flex grow-0 flex-col gap-1">
        <div>{name}</div>
        <div className="italic">{description}</div>
      </div>
    </div>
  )
}
