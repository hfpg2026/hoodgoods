// styles adapted from https://tailwind-starter-kit.vercel.app/

import { type ReactNode } from 'react'

export const Button = ({
  onClick,
  outline,
  isActive,
  children,
}: {
  onClick?: VoidFunction
  outline?: boolean
  isActive?: boolean
  children: ReactNode
}) => {
  const defaultClass = `focus:shadow-outline bg-dark-brown min-h-9 rounded-lg px-5 text-bg-main transition-colors duration-150`
  const outlineClass =
    'min-h-9 px-5 text-dark-brown transition-colors duration-150 border border-dark-brown rounded-lg focus:shadow-outline hover:bg-dark-brown hover:text-bg-main'

  return (
    <button
      className={outline && !isActive ? outlineClass : defaultClass}
      onClick={onClick}
    >
      {children}
    </button>
  )
}
