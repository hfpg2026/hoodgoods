'use client'

import { useRef } from 'react'
import {
  dataAttr,
  govtBannerStyles,
  twMerge,
  type GovtBannerSlots,
  type SlotsToClasses,
} from '@/app/theme'
import { ChevronDown, ExternalLink, Landmark, Lock } from 'lucide-react'
import {
  mergeProps,
  useButton,
  useDisclosure,
  useFocusRing,
  useMessageFormatter,
  type LocalizedStrings,
} from 'react-aria'
import { useDisclosureState, type DisclosureProps } from 'react-stately'
import type { LiteralUnion } from 'type-fest'

interface GovtBannerProps extends DisclosureProps {
  /**
   * The environment of the application. If provided, the banner will display a note indicating the environment:
   * ```
   * [NOTE: THIS IS A {environment} WEBSITE]
   * ```
   */
  environment?: LiteralUnion<
    'production' | 'staging' | 'uat' | 'preview',
    string
  >

  /**
   * List of classes to change the className of the element.
   *
   * @example
   * ```text
   * Component: GovtBanner
   *
   * Class names:
   * - banner: the wrapper of the full government banner component,
   * - mainContentContainer: the wrapper of the main content of the banner
   * - crest: the SVG of the government crest
   * - mainContent: the main content of the banner
   * - link: link stylings
   * - identifyButton: for the "how to identify" button
   * - chevron: the chevron icon beside the "how to identify" button
   * - panel: the wrapper for the panel that appears when the "how to identify" button is clicked
   * - panelGroup: the wrapper for the panel group containing the icon and the panel section
   * - panelIcon: the icon in the panel group
   * - panelSection: the wrapper for the panel section containing the header and content
   * - panelHeader: the header in the panel section
   * - inlineIcon: the icon in the panel content
   * ```
   */
  classNames?: SlotsToClasses<GovtBannerSlots>
}

// TODO: Add strings for other localisations
const i18nStrings: LocalizedStrings = {
  'en-SG': {
    mainLabel: 'A Singapore Government Agency Website',
    identifyLabel: 'How to identify',
    environmentLabel: '[NOTE: THIS IS A {environment} WEBSITE]',
    officialLinkHeader: 'Official website links end with .gov.sg',
    officialLinkContent:
      'Government agencies communicate via <boldThis>.gov.sg</boldThis> websites (e.g. go.gov.sg/open).',
    officialLinkTrusted: 'Trusted websites',
    secureHeader: 'Secure websites use HTTPS',
    secureContent:
      'Look for a <boldThis>lock</boldThis> {icon} or https:// as an added precaution. Share sensitive information only on official, secure websites.',
  },
  'zh-SG': {
    mainLabel: 'A Singapore Government Agency Website',
    identifyLabel: 'How to identify',
    environmentLabel: '[NOTE: THIS IS A {environment} WEBSITE]',
    officialLinkHeader: 'Official website links end with .gov.sg',
    officialLinkContent:
      'Government agencies communicate via <boldThis>.gov.sg</boldThis> websites (e.g. go.gov.sg/open).',
    officialLinkTrusted: 'Trusted websites',
    secureHeader: 'Secure websites use HTTPS',
    secureContent:
      'Look for a <boldThis>lock</boldThis> {icon} or https:// as an added precaution. Share sensitive information only on official, secure websites.',
  },
  'ms-SG': {
    mainLabel: 'A Singapore Government Agency Website',
    identifyLabel: 'How to identify',
    environmentLabel: '[NOTE: THIS IS A {environment} WEBSITE]',
    officialLinkHeader: 'Official website links end with .gov.sg',
    officialLinkContent:
      'Government agencies communicate via <boldThis>.gov.sg</boldThis> websites (e.g. go.gov.sg/open).',
    officialLinkTrusted: 'Trusted websites',
    secureHeader: 'Secure websites use HTTPS',
    secureContent:
      'Look for a <boldThis>lock</boldThis> {icon} or https:// as an added precaution. Share sensitive information only on official, secure websites.',
  },
  'ta-SG': {
    mainLabel: 'A Singapore Government Agency Website',
    identifyLabel: 'How to identify',
    environmentLabel: '[NOTE: THIS IS A {environment} WEBSITE]',
    officialLinkHeader: 'Official website links end with .gov.sg',
    officialLinkContent:
      'Government agencies communicate via <boldThis>.gov.sg</boldThis> websites (e.g. go.gov.sg/open).',
    officialLinkTrusted: 'Trusted websites',
    secureHeader: 'Secure websites use HTTPS',
    secureContent:
      'Look for a <boldThis>lock</boldThis> {icon} or https:// as an added precaution. Share sensitive information only on official, secure websites.',
  },
}

export function GovtBanner({
  environment,
  classNames,
  ...props
}: GovtBannerProps) {
  const formatMessage = useMessageFormatter(i18nStrings)

  const state = useDisclosureState(props)
  const panelRef = useRef<HTMLDivElement | null>(null)
  const triggerRef = useRef<HTMLButtonElement | null>(null)

  const { buttonProps: triggerProps, panelProps } = useDisclosure(
    props,
    state,
    panelRef,
  )
  const { buttonProps } = useButton(triggerProps, triggerRef)
  const { isFocusVisible, focusProps } = useFocusRing()

  const slots = govtBannerStyles()

  return (
    <div
      className={slots.banner({ className: classNames?.banner })}
      role="banner"
    >
      <div
        className={slots.mainContentContainer({
          className: classNames?.mainContentContainer,
        })}
      >
        <svg
          className={slots.crest({ className: classNames?.crest })}
          version="1.1"
          viewBox="0 0 32 32"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M5.896 11.185c0 0-0.949 1.341 0.294 3.075 0 0 0.196-0.883 2.159-0.883h2.356c2.225 0 3.893-2.126 2.846-4.319 0 0 1.57 0.164 2.095-0.818 0.523-0.981-0.033-1.374-0.818-1.374h-3.959c0 0.704-1.341 0.802-1.341 0h-2.225c0 0-1.669 0-1.701 1.407 0 0 0.377-0.229 0.752-0.261v0.375c0 0-0.458 0.082-0.671 0.197-0.212 0.114-0.523 0.425-0.228 1.227 0.294 0.801 0.409 1.079 0.409 1.079s0.475-0.41 1.244-0.41h0.9c1.602 0 1.308 1.554-0.295 1.554s-1.815-0.85-1.815-0.85z" />
          <path d="M14.255 9.566c0 0 0.54 0.033 0.932-0.31 0 0 3.55 2.765-1.717 8.326-5.268 5.562-1.195 9.162-1.195 9.162s-0.948 0.915-0.409 2.699c0 0-2.191-1.237-3.867-3.338-2.422-3.036-3.902-7.681 2.749-11.386 0 0 4.389-2.208 3.506-5.153z" />
          <path d="M8.829 6.343c0 0 0.709-1.265 2.355-1.265 1.298 0 1.594-0.666 1.594-0.666s0.566-1.079 3.424-1.079c2.619 0 4.384 0.873 5.812 2.039 0 0-3.85-2.388-7.645 0.971h-5.54z" />
          <path d="M24.839 14.348c-0.109-3.948-3.163-8.179-9.728-7.939 6.413-5.431 17.537 6.695 8.375 13.066 0 0 1.533-2.186 1.353-5.126z" />
          <path d="M16.093 6.845c8.005-0.24 10.863 9.357 5.693 13.676l-5.191 2.509c0 0-0.676-2.181 1.833-4.734 2.509-2.551 4.929-7.328-2.006-10.469 0 0 0.131-0.654-0.327-0.981z" />
          <path d="M15.678 9.004c0 0 0.393-0.371 0.524-0.676 5.954 2.486 5.017 6.697 1.461 10.23-2.181 2.246-1.505 4.668-1.505 4.668s-2.66 1.657-3.577 3.097c0 0-3.852-3.28 1.483-8.724 5.235-5.344 1.614-8.594 1.614-8.594z" />
        </svg>
        <div
          className={slots.mainContent({ className: classNames?.mainContent })}
        >
          <span>{formatMessage('mainLabel')}</span>
          {environment ? (
            <b>
              {formatMessage('environmentLabel', {
                environment: environment.toUpperCase(),
              })}
            </b>
          ) : null}
          <button
            className={slots.identifyButton({
              className: classNames?.identifyButton,
            })}
            data-focus-visible={dataAttr(isFocusVisible)}
            ref={triggerRef}
            type="button"
            {...mergeProps(buttonProps, focusProps)}
          >
            <span className={slots.link({ className: classNames?.link })}>
              {formatMessage('identifyLabel')}
            </span>
            <ChevronDown
              className={slots.chevron({ className: classNames?.chevron })}
            />
          </button>
        </div>
      </div>

      <div ref={panelRef} {...panelProps}>
        <div className={slots.panel({ className: classNames?.panel })}>
          <div
            className={slots.panelGroup({
              className: classNames?.panelGroup,
            })}
          >
            <Landmark
              className={slots.panelIcon({ className: classNames?.panelIcon })}
            />
            <div
              className={slots.panelSection({
                className: classNames?.panelSection,
              })}
            >
              <div
                className={slots.panelHeader({
                  className: classNames?.panelHeader,
                })}
              >
                {formatMessage('officialLinkHeader')}
              </div>
              <article>
                {formatMessage('officialLinkContent', {
                  boldThis: (content: string) => <b>{content}</b>,
                })}{' '}
                <a
                  className={slots.link({ className: classNames?.link })}
                  href="https://www.gov.sg/trusted-sites#govsites"
                  rel="noreferrer"
                  target="_blank"
                >
                  {formatMessage('officialLinkTrusted', {})}
                  <ExternalLink
                    aria-hidden
                    className={slots.inlineIcon({
                      className: twMerge('ml-0.5', classNames?.inlineIcon),
                    })}
                  />
                </a>
              </article>
            </div>
          </div>
          <div
            className={slots.panelGroup({
              className: classNames?.panelGroup,
            })}
          >
            <Lock
              className={slots.panelIcon({ className: classNames?.panelIcon })}
            />
            <div
              className={slots.panelSection({
                className: classNames?.panelSection,
              })}
            >
              <p
                className={slots.panelHeader({
                  className: classNames?.panelHeader,
                })}
              >
                {formatMessage('secureHeader')}
              </p>
              <article>
                {formatMessage('secureContent', {
                  boldThis: (content: string) => <b>{content}</b>,
                  icon: (
                    <span aria-hidden>
                      (
                      <Lock
                        className={slots.inlineIcon({
                          className: classNames?.inlineIcon,
                        })}
                      />
                      )
                    </span>
                  ),
                })}
              </article>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
