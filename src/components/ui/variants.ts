import { cva } from 'class-variance-authority'

export const navLinkVariants = cva('border-b-2 pb-2 text-sm font-semibold transition-colors', {
  variants: {
    active: {
      true: 'border-brand-500 text-brand-500',
      false: 'border-transparent text-neutral-700 hover:text-neutral-900',
    },
  },
  defaultVariants: {
    active: false,
  },
})

export const pillVariants = cva(
  'cursor-pointer rounded-full px-4 py-2 text-sm font-medium transition-colors',
  {
    variants: {
      active: {
        true: 'bg-brand-500 text-white',
        false: 'bg-neutral-100 text-neutral-800 hover:bg-neutral-200',
      },
    },
    defaultVariants: {
      active: false,
    },
  },
)

export const cardVariants = cva(
  'rounded-2xl bg-white py-3 px-4 text-left transition-all duration-200 hover:-translate-y-1 hover:shadow-md',
)

export const badgeVariants = cva(
  'rounded-full px-2 py-0.5 text-xs font-bold uppercase tracking-wide',
  {
    variants: {
      tier: {
        free: 'text-brand-500',
        pro: 'text-secondary-500',
        professional: 'text-tertiary-600',
      },
    },
    defaultVariants: {
      tier: 'free',
    },
  },
)
