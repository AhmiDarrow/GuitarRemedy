import { LOCALES, isLocaleId } from '../i18n/locales'
import { useI18n } from '../i18n/useI18n'
import { useAppStore } from '../store/appStore'

/** Native language names. The control uses the UI font so CJK glyphs render. */
export function LanguagePicker({ id = 'app-language' }: { id?: string }) {
  const locale = useAppStore((s) => s.locale)
  const setLocale = useAppStore((s) => s.setLocale)
  const { tx } = useI18n()

  return (
    <label className="block text-sm" htmlFor={id}>
      <span className="mb-1.5 block text-soft">{tx('Language')}</span>
      <select
        id={id}
        className="select font-sans"
        value={locale}
        onChange={(event) => {
          const next = event.target.value
          if (isLocaleId(next)) setLocale(next)
        }}
      >
        {LOCALES.map((item) => (
          <option key={item.id} value={item.id} lang={item.bcp47}>
            {item.native}
          </option>
        ))}
      </select>
    </label>
  )
}
