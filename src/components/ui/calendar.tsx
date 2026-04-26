import { DayPicker, type DayPickerProps } from 'react-day-picker'

import { cn } from '@/lib/utils'

import 'react-day-picker/style.css'

export function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: DayPickerProps) {
  return (
    <DayPicker
      className={cn('p-3', className)}
      classNames={classNames}
      showOutsideDays={showOutsideDays}
      {...props}
    />
  )
}
