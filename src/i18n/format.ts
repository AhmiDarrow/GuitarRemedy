import { localeMeta as metaOf } from './locales'
import { getLocale } from './runtime'

function tag(): string {
  return metaOf(getLocale()).bcp47
}

export function formatNumber(value: number, options?: Intl.NumberFormatOptions): string {
  try {
    return new Intl.NumberFormat(tag(), options).format(value)
  } catch {
    return String(value)
  }
}

export function formatDate(value: string | number | Date, options?: Intl.DateTimeFormatOptions): string {
  const date = value instanceof Date ? value : new Date(value)
  if (Number.isNaN(date.getTime())) return typeof value === 'string' ? value : ''
  try {
    return new Intl.DateTimeFormat(tag(), options ?? { dateStyle: 'medium' }).format(date)
  } catch {
    return typeof value === 'string' ? value : date.toISOString().slice(0, 10)
  }
}

/** Practice dates are stored as YYYY-MM-DD (local). Show them in the active locale. */
export function formatDayStamp(isoDay: string): string {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(isoDay.trim())
  if (!match) return isoDay
  const date = new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]))
  return formatDate(date, { year: 'numeric', month: 'short', day: 'numeric' })
}

export function formatMinutes(n: number): string {
  try {
    return new Intl.NumberFormat(tag(), { style: 'unit', unit: 'minute', unitDisplay: 'short' }).format(n)
  } catch {
    return `${n} min`
  }
}


