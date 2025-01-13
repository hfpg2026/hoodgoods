import type { VariantProps } from 'tailwind-variants'

import { cn, focusVisibleClasses, tv } from './utils'

export const govtBannerStyles = tv({
  slots: {
    banner: 'bg-[#f0f0f0] px-4 text-xs text-[#474747] lg:text-base',
    mainContentContainer: 'flex min-h-7 items-center gap-2 py-1',
    crest:
      'h-5 w-4 flex-shrink-0 self-start align-top has-[path]:fill-[#ef3320] lg:h-5 lg:w-5',
    mainContent: 'flex flex-wrap gap-x-1 text-xs lg:text-sm',
    link: 'text-[#2f5fd0] underline hover:text-[#4371d6]',
    identifyButton: cn(
      'inline-flex cursor-pointer items-center rounded text-[#2f5fd0]',
      focusVisibleClasses,
    ),
    panel:
      'flex flex-row gap-x-4 gap-y-4 py-6 max-md:flex-col md:py-8 lg:gap-x-36 lg:py-11',
    panelGroup: 'flex flex-1 gap-2 md:gap-4',
    panelSection: 'flex flex-col gap-y-2 lg:gap-y-3',
    panelIcon:
      'inline-block h-4 w-4 shrink-0 self-start md:h-5 md:w-5 lg:h-6 lg:w-6',
    chevron:
      'h-4 w-4 in-aria-expanded:rotate-180 motion-safe:transition-transform',
    inlineIcon: 'inline-block h-4 w-3 shrink-0 align-text-bottom lg:h-5 lg:w-4',
    panelHeader: 'leading-4 font-bold md:leading-5 lg:leading-6',
  },
})

export type GovtBannerVariantProps = VariantProps<typeof govtBannerStyles>
export type GovtBannerSlots = keyof ReturnType<typeof govtBannerStyles>
