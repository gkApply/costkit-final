import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

type SectionSize = 'sm' | 'md' | 'lg'

type SectionProps = {
  children: ReactNode
  className?: string
  size?: SectionSize
}

const sizeClasses: Record<SectionSize, string> = {
  sm: 'py-8 md:py-12',
  md: 'py-16 md:py-20 lg:py-24',
  lg: 'py-20 md:py-28 lg:py-32',
}

export function Section({ children, className, size = 'md' }: SectionProps) {
  return <section className={cn(sizeClasses[size], className)}>{children}</section>
}

export default Section
