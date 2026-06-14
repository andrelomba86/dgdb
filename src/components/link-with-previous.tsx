'use client'

import NextLink from 'next/link'
import React, { forwardRef } from 'react'
import type { ReactNode, AnchorHTMLAttributes } from 'react'
import { setPrevious } from '@/hooks/use-back-navigation'

type LinkWithPreviousProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  href: string
  actionKey: string
  children: ReactNode
}

export const LinkWithPrevious = forwardRef<HTMLAnchorElement, LinkWithPreviousProps>(
  function LinkWithPrevious({ href, actionKey, children, ...props }, ref) {
    const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
      try {
        const current = window.location.pathname + window.location.search
        setPrevious(actionKey, current)
      } catch {
        // noop
      }
      // allow default link behavior
    }

    return (
      <NextLink href={href} legacyBehavior>
        <a ref={ref} onClick={handleClick} {...props}>
          {children}
        </a>
      </NextLink>
    )
  }
)

LinkWithPrevious.displayName = 'LinkWithPrevious'
