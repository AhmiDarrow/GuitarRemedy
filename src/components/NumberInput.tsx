import { useEffect, useRef, useState, type InputHTMLAttributes } from 'react'

type NativeProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'type' | 'value' | 'defaultValue' | 'onChange' | 'min' | 'max'
>

export interface NumberInputProps extends NativeProps {
  value: number
  /** Called with a finite value inside [min, max]. */
  onCommit: (n: number) => void
  min?: number
  max?: number
  /** Round committed values to whole numbers (BPM, Hz, frets, MIDI notes). */
  integer?: boolean
}

/**
 * Parse a typed draft. Returns the number only when it is complete and in range,
 * so partially typed values ("1" on the way to "120") never reach the store.
 */
export function parseNumberDraft(
  raw: string,
  min?: number,
  max?: number,
  integer = false,
): number | null {
  if (raw.trim() === '') return null
  const parsed = Number(raw)
  const n = integer ? Math.round(parsed) : parsed
  if (!Number.isFinite(n)) return null
  if (min != null && n < min) return null
  if (max != null && n > max) return null
  return n
}

/** Clamp a finished draft into range on blur / Enter; null when not a number. */
export function settleNumberDraft(
  raw: string,
  min?: number,
  max?: number,
  integer = false,
): number | null {
  if (raw.trim() === '') return null
  const n = Number(raw)
  if (!Number.isFinite(n)) return null
  let v = integer ? Math.round(n) : n
  if (min != null) v = Math.max(min, v)
  if (max != null) v = Math.min(max, v)
  return v
}

/**
 * Number field that keeps the user's typing as a local draft. In-range values
 * commit as you type; anything else is clamped (or reverted) on blur / Enter.
 * Fixes clamped controlled inputs snapping "1" → 30 before "120" can be typed.
 */
export function NumberInput({ value, onCommit, min, max, integer = false, onBlur, onKeyDown, ...rest }: NumberInputProps) {
  const [draft, setDraft] = useState(() => String(value))
  const focused = useRef(false)

  useEffect(() => {
    if (!focused.current) setDraft(String(value))
  }, [value])

  const settle = () => {
    const v = settleNumberDraft(draft, min, max, integer)
    if (v == null) {
      setDraft(String(value))
      return
    }
    if (v !== value) onCommit(v)
    setDraft(String(v))
  }

  return (
    <input
      {...rest}
      type="number"
      inputMode={rest.inputMode ?? (integer ? 'numeric' : 'decimal')}
      min={min}
      max={max}
      value={draft}
      onFocus={(e) => {
        focused.current = true
        rest.onFocus?.(e)
      }}
      onChange={(e) => {
        const raw = e.target.value
        setDraft(raw)
        const n = parseNumberDraft(raw, min, max, integer)
        if (n != null && n !== value) onCommit(n)
      }}
      onBlur={(e) => {
        focused.current = false
        settle()
        onBlur?.(e)
      }}
      onKeyDown={(e) => {
        if (e.key === 'Enter') settle()
        onKeyDown?.(e)
      }}
    />
  )
}
