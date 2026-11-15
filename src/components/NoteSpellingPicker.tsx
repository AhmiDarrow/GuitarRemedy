import { isNoteSpelling, type NoteSpelling } from '../i18n/notes'
import { useI18n } from '../i18n/useI18n'
import { useAppStore } from '../store/appStore'

/** Optional pitch-name display. Default stays letter names. */
export function NoteSpellingPicker({ id = 'note-spelling' }: { id?: string }) {
  const spelling = useAppStore((s) => s.noteSpelling)
  const setNoteSpelling = useAppStore((s) => s.setNoteSpelling)
  const { tx } = useI18n()
  const options: { id: NoteSpelling; label: string }[] = [
    { id: 'letters', label: tx('Letter names (C D E)') },
    { id: 'solfege', label: tx('Solfège (Do Re Mi)') },
    { id: 'german', label: tx('German (C H)') },
  ]

  return (
    <label className="block text-sm" htmlFor={id}>
      <span className="mb-1.5 block text-soft">{tx('Note names')}</span>
      <select
        id={id}
        className="select font-sans"
        value={spelling}
        onChange={(event) => {
          const next = event.target.value
          if (isNoteSpelling(next)) setNoteSpelling(next)
        }}
      >
        {options.map((item) => (
          <option key={item.id} value={item.id}>
            {item.label}
          </option>
        ))}
      </select>
      <p className="mt-1.5 text-xs text-muted">
        {tx('How pitch names appear on the fretboard and tuner. Lessons and tabs keep letter names.')}
      </p>
    </label>
  )
}
