import { useCallback, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  FileUp,
  AlertTriangle,
  Sparkles,
  Download,
  Loader2,
  Guitar,
  Save,
  Library,
  CheckCircle2,
  FileDown,
  Pencil,
} from 'lucide-react'
import {
  AUDIO_FORMATS_LABEL,
  isAudioUpload,
  parseUploadedFile,
  setSessionPreferPosition,
  setSessionTuning,
  UPLOAD_ACCEPT,
  type ConvertStage,
  type RemedyBreakdown,
  type TabScore,
} from '../lib/breakdown'
import { setEditorTuning } from '../lib/tabEdit'
import { convertStemDrafts, downloadMidiBytes } from '../lib/audioToMidi'
import {
  downloadAsciiTab,
  downloadUserTabFile,
  downloadUserTabMidi,
  type UserTab,
} from '../lib/userTabs'
import { TabView } from '../components/TabView'
import { TabEditor } from '../components/TabEditor'
import { Fretboard } from '../components/Fretboard'
import { getScale, noteToPc } from '../lib/theory'
import { applyScoreToBreakdown } from '../lib/tabEdit'
import { useAppStore } from '../store/appStore'
import { useUserTabsStore } from '../store/userTabsStore'
import { useI18n } from '../i18n/useI18n'
import { isTauri, openMusicFileNative } from '../lib/desktop'

function toScore(b: RemedyBreakdown): TabScore {
  return (
    b.score ?? {
      title: b.title,
      tempo: b.tempoBpm,
      key: `${b.key.root} ${b.key.scaleName}`,
      strings: 6,
      notes: b.tabNotes,
    }
  )
}

const PIPELINE_STEP_IDS: ConvertStage[] = ['decode', 'audio_to_midi', 'midi_to_tabs']

function stageIndex(stage: ConvertStage | null): number {
  if (!stage || stage === 'idle') return -1
  if (stage === 'done') return 3
  if (stage === 'error') return -2
  return PIPELINE_STEP_IDS.indexOf(stage)
}

export function UploadPage() {
  const { tx } = useI18n()
  const recordPractice = useAppStore((s) => s.recordPractice)
  const getTuning = useAppStore((s) => s.getTuning)
  const a4 = useAppStore((s) => s.a4)
  const saveFromBreakdown = useUserTabsStore((s) => s.saveFromBreakdown)
  const persistError = useUserTabsStore((s) => s.persistError)
  const userTabCount = useUserTabsStore((s) => s.tabs.length)
  const [breakdown, setBreakdown] = useState<RemedyBreakdown | null>(null)
  const [savedTab, setSavedTab] = useState<UserTab | null>(null)
  const [busy, setBusy] = useState(false)
  const [status, setStatus] = useState<string | null>(null)
  const [stage, setStage] = useState<ConvertStage | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [drag, setDrag] = useState(false)
  const [editing, setEditing] = useState(false)
  /** 0 = auto-detect tempo */
  const [tempoOverride, setTempoOverride] = useState(0)
  /** 0 = full file; else first N seconds */
  const [trimSec, setTrimSec] = useState(90)
  /** HPSS stem for full-band mixes — auto races lead/harmonic/mix */
  const [stem, setStem] = useState<'auto' | 'lead' | 'harmonic' | 'mix'>('auto')
  /** mono = lock lead · multi = keep chords · auto = engine pick */
  const [voiceMode, setVoiceMode] = useState<'auto' | 'mono' | 'multi'>('auto')
  const [swing, setSwing] = useState<'none' | 'light' | 'medium'>('none')
  const [preferPosition, setPreferPosition] = useState<'auto' | 'open' | 'mid'>('auto')
  const [sourceAudioUrl, setSourceAudioUrl] = useState<string | null>(null)
  const [sourceArrayBuffer, setSourceArrayBuffer] = useState<ArrayBuffer | null>(null)
  const [stemDrafts, setStemDrafts] = useState<
    Array<{ stem: string; score: number; noteCount: number }>
  >([])
  /** 0–100 while audio convert runs (from pcmToMidi onProgress). */
  const [progressPct, setProgressPct] = useState(0)

  const persistBreakdown = useCallback(
    (
      b: RemedyBreakdown,
      opts?: string | { sourceName?: string; replaceId?: string },
    ) => {
      if (b.isPlaceholder) {
        setSavedTab(null)
        return null
      }
      const noteCount = b.score?.notes?.length || b.tabNotes?.length || b.tab?.length || 0
      if (noteCount === 0) {
        setSavedTab(null)
        return null
      }
      const normalized =
        typeof opts === 'string' ? { sourceName: opts } : opts ?? undefined
      const tab = saveFromBreakdown(b, normalized)
      setSavedTab(tab)
      if (tab) recordPractice()
      return tab
    },
    [recordPractice, saveFromBreakdown],
  )

  const runFile = useCallback(
    async (file: File) => {
      setBusy(true)
      setError(null)
      setBreakdown(null)
      setSavedTab(null)
      setEditing(false)
      setProgressPct(0)
      setStemDrafts([])
      setSourceArrayBuffer(null)
      if (sourceAudioUrl) {
        URL.revokeObjectURL(sourceAudioUrl)
        setSourceAudioUrl(null)
      }
      const audio = isAudioUpload(file)
      if (audio) {
        setSourceAudioUrl(URL.createObjectURL(file))
      }
      setStage(audio ? 'decode' : 'midi_to_tabs')
      setStatus(audio ? tx('1/3 Decoding audio…') : tx('Parsing {name}…', { name: file.name }))
      try {
        // Fretting + editor cleanup follow Profile tuning (Drop D, custom, …).
        const tuning = getTuning()
        setSessionTuning(tuning)
        setEditorTuning(tuning)
        setSessionPreferPosition(preferPosition)
        // Snapshot bytes once (arrayBuffer is single-use on some browsers).
        let audioBytes: ArrayBuffer | null = null
        if (audio) {
          audioBytes = await file.arrayBuffer()
          setSourceArrayBuffer(audioBytes)
        }
        const parseSource =
          audio && audioBytes
            ? {
                name: file.name,
                arrayBuffer: async () => audioBytes!.slice(0),
              }
            : file
        const b = await parseUploadedFile(parseSource, {
          onProgress: (s, message) => {
            setStage(s)
            setStatus(message)
            const m = message.match(/\((\d{1,3})%\)/)
            if (m) setProgressPct(Math.min(100, Number(m[1])))
            else if (s === 'decode') setProgressPct(5)
            else if (s === 'audio_to_midi') setProgressPct((p) => Math.max(p, 15))
            else if (s === 'midi_to_tabs') setProgressPct(90)
            else if (s === 'done') setProgressPct(100)
          },
          tempoBpm: audio && tempoOverride > 0 ? tempoOverride : undefined,
          a4: audio ? a4 : undefined,
          maxSec: audio && trimSec > 0 ? trimSec : undefined,
          stem: audio ? stem : undefined,
          voiceMode: audio ? voiceMode : undefined,
          swing: audio ? swing : undefined,
          preferPosition: audio ? preferPosition : undefined,
          // Explicit tuning on every path — not only module session side-effect.
          tuning,
        })
        setBreakdown(b)
        setStage(b.kind === 'unknown' ? 'error' : 'done')
        if (audio && audioBytes) {
          try {
            const drafts = await convertStemDrafts(audioBytes.slice(0), {
              a4,
              maxSec: trimSec > 0 ? trimSec : undefined,
              tempoBpm: tempoOverride > 0 ? tempoOverride : undefined,
              voiceMode,
              swing,
            })
            setStemDrafts(
              drafts.map((d) => ({
                stem: d.stem,
                score: d.score,
                noteCount: d.notes.length,
              })),
            )
          } catch {
            /* stem drafts optional */
          }
        }
        const saved = persistBreakdown(b, file.name)
        const ready = tx('Ready · {count} notes', { count: b.tabNotes.length })
        const base = b.statusMessage ?? ready
        if (saved) {
          setStatus(tx('{base} · saved to Your tabs', { base }))
        } else {
          setStatus(base)
        }
      } catch (e) {
        setError(e instanceof Error ? e.message : tx('Could not parse file'))
        setBreakdown(null)
        setSavedTab(null)
        setStage('error')
        setStatus(null)
      } finally {
        setBusy(false)
      }
    },
    [
      persistBreakdown,
      sourceAudioUrl,
      tempoOverride,
      trimSec,
      stem,
      voiceMode,
      swing,
      preferPosition,
      getTuning,
      a4,
      tx,
    ],
  )

  const onInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]
    if (f) void runFile(f)
    e.target.value = ''
  }

  const openDesktopFile = useCallback(async () => {
    try {
      const file = await openMusicFileNative()
      if (file) void runFile(file)
    } catch (e) {
      setError(e instanceof Error ? e.message : tx('Could not open file'))
      setStage('error')
    }
  }, [runFile, tx])

  const onDownloadMidi = () => {
    if (breakdown?.midiBytes) {
      const base = (breakdown.title || 'converted').replace(/[^\w\-]+/g, '_').slice(0, 48)
      downloadMidiBytes(breakdown.midiBytes, `${base}.mid`)
      return
    }
    // Rebuild from score with embedded tempo when SMF wasn't stored (e.g. after edit).
    const tab = savedTab ?? (breakdown ? persistBreakdown(breakdown) : null)
    if (tab) downloadUserTabMidi(tab)
  }

  const onExportTabFile = () => {
    if (savedTab) {
      downloadUserTabFile(savedTab)
      return
    }
    if (!breakdown) return
    const tab = persistBreakdown(breakdown)
    if (tab) downloadUserTabFile(tab)
  }

  const onExportAscii = () => {
    const tab = savedTab ?? (breakdown ? persistBreakdown(breakdown) : null)
    if (tab) downloadAsciiTab(tab)
  }

  const onSaveAgain = () => {
    if (!breakdown) return
    const tab = persistBreakdown(breakdown, {
      sourceName: savedTab?.sourceName,
      replaceId: savedTab?.id,
    })
    if (tab) setStatus(tx('Saved “{title}” to Your tabs', { title: tab.title }))
  }

  const onEditorSave = (score: TabScore) => {
    if (!breakdown) return
    const next = applyScoreToBreakdown(breakdown, score)
    setBreakdown(next)
    const tab = persistBreakdown(next, {
      sourceName: savedTab?.sourceName,
      replaceId: savedTab?.id,
    })
    setEditing(false)
    setStatus(
      tab
        ? tx('Edits saved · “{title}” · {count} notes', {
            title: tab.title,
            count: score.notes.length,
          })
        : tx('Edits applied · {count} notes', { count: score.notes.length }),
    )
  }

  const pipelineSteps = [
    { id: 'decode' as const, label: tx('1. Decode audio') },
    { id: 'audio_to_midi' as const, label: tx('2. Audio to MIDI') },
    { id: 'midi_to_tabs' as const, label: tx('3. MIDI to tabs') },
  ]
  const scaleId = breakdown?.scaleId || 'major'
  // Prefer getScale so camelCase / alias ids from analysis still resolve.
  const scale = getScale(scaleId)
  const root = breakdown ? noteToPc(breakdown.key.root) : 0
  const activeIdx = stageIndex(stage)

  return (
    <div className="space-y-6 animate-fade-up">
      <div className="relative overflow-hidden rounded-3xl border border-[var(--border)]">
        <img
          src="/assets/practice-grove.png"
          alt=""
          className="absolute inset-0 h-full w-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg)] via-[var(--bg)]/85 to-[var(--bg)]/40" />
        <div className="relative p-5 md:p-7">
          <p className="section-title">{tx('Upload')}</p>
          <h1 className="font-display text-3xl font-bold tracking-tight mt-1">{tx('Song → tabs')}</h1>
          <p className="text-[var(--text-muted)] mt-2 text-sm max-w-2xl leading-relaxed">
            {tx('Drop an ')}
            <strong className="text-mint font-medium">{tx('MP3 / WAV')}</strong>
            {tx(' and Remedy runs a clean three-step converter: ')}
            <span className="text-[var(--text)]">{tx('decode audio')}</span>
            {tx(' → ')}
            <span className="text-[var(--text)]">{tx('audio to MIDI')}</span>
            {tx(' → ')}
            <span className="text-[var(--text)]">{tx('MIDI to guitar tabs')}</span>
            {tx('. MIDI and MusicXML are the solid structured path. Guitar Pro is best-effort (placeholders never auto-save). Audio is a lead-biased multipitch draft (up to ~4 fretted voices) — always editable, never a perfect full-band multi-track auto-tab.')}
          </p>
        </div>
      </div>

      {/* Pipeline strip */}
      <div className="card p-4">
        <p className="section-title mb-3">{tx('Converter pipeline')}</p>
        <ol className="grid sm:grid-cols-3 gap-2">
          {pipelineSteps.map((step, i) => {
            const done = activeIdx > i || stage === 'done'
            const current = activeIdx === i && busy
            return (
              <li
                key={step.id}
                className={`rounded-xl border px-3 py-2.5 text-sm flex items-center gap-2 transition-colors ${
                  done
                    ? 'border-mint/40 bg-mint/10 text-mint'
                    : current
                      ? 'border-mint bg-mint/5 text-[var(--text)]'
                      : 'border-[var(--border)] text-[var(--text-muted)]'
                }`}
              >
                {current ? (
                  <Loader2 className="w-4 h-4 animate-spin shrink-0" />
                ) : done ? (
                  <span className="w-4 h-4 rounded-full bg-mint/30 text-[10px] flex items-center justify-center shrink-0">
                    ✓
                  </span>
                ) : (
                  <span className="w-4 h-4 rounded-full border border-current/40 text-[10px] flex items-center justify-center shrink-0">
                    {i + 1}
                  </span>
                )}
                <span className="font-medium">{step.label}</span>
              </li>
            )
          })}
        </ol>
        <p className="text-xs text-[var(--text-muted)] mt-3 leading-relaxed">
          <Guitar className="w-3.5 h-3.5 inline mr-1 text-mint" />
          {tx('Best results: dry single-note or clear guitar lead. Full-band mixes use stereo mid (+ side when hard-panned), ')}
          <strong className="text-[var(--text)]">{tx('Auto stem')}</strong>
          {tx(' (HPSS lead / harmonic / mix / side), then a ')}
          <strong className="text-[var(--text)]">{tx('pitch-engine race')}</strong>
          {tx('(Basic Pitch multipitch vs autocorrelation) — keeps up to ~4 fretted voices when detected; always edit by ear. Prefer MIDI/MusicXML when you have them.')}
        </p>
        <div className="mt-4 grid sm:grid-cols-3 gap-3">
          <label className="block text-xs text-[var(--text-muted)]">
            {tx('Tempo override (BPM)')}
            <input
              type="number"
              min={0}
              max={300}
              className="input mt-1"
              value={tempoOverride || ''}
              placeholder={tx('Auto-detect')}
              disabled={busy}
              onChange={(e) => setTempoOverride(Math.max(0, Number(e.target.value) || 0))}
            />
            <span className="text-[10px] opacity-80">{tx('0 or empty = detect from audio')}</span>
          </label>
          <label className="block text-xs text-[var(--text-muted)]">
            {tx('Analyze first (seconds)')}
            <input
              type="number"
              min={0}
              max={600}
              className="input mt-1"
              value={trimSec}
              disabled={busy}
              onChange={(e) => setTrimSec(Math.max(0, Number(e.target.value) || 0))}
            />
            <span className="text-[10px] opacity-80">{tx('0 = full file · default 90s for long mixes')}</span>
          </label>
          <label className="block text-xs text-[var(--text-muted)]">
            {tx('Full-band stem (HPSS)')}
            <select
              className="input mt-1"
              value={stem}
              disabled={busy}
              onChange={(e) =>
                setStem(e.target.value as 'auto' | 'lead' | 'harmonic' | 'mix')
              }
            >
              <option value="auto">{tx('Auto (default · race stems)')}</option>
              <option value="lead">{tx('Lead only')}</option>
              <option value="harmonic">{tx('Harmonic only')}</option>
              <option value="mix">{tx('Full mix (no HPSS · harder)')}</option>
            </select>
            <span className="text-[10px] opacity-80">
              {tx('Auto races lead / harmonic / mix (+ side on stereo) for the cleanest fretting draft')}
            </span>
          </label>
          <label className="block text-xs text-[var(--text-muted)]">
            {tx('Voices')}
            <select
              className="input mt-1"
              value={voiceMode}
              disabled={busy}
              onChange={(e) => setVoiceMode(e.target.value as 'auto' | 'mono' | 'multi')}
            >
              <option value="auto">{tx('Auto (default)')}</option>
              <option value="mono">{tx('Lock lead (mono)')}</option>
              <option value="multi">{tx('Keep multipitch')}</option>
            </select>
            <span className="text-[10px] opacity-80">{tx('Mono when the mix is muddy')}</span>
          </label>
          <label className="block text-xs text-[var(--text-muted)]">
            {tx('Swing feel')}
            <select
              className="input mt-1"
              value={swing}
              disabled={busy}
              onChange={(e) => setSwing(e.target.value as 'none' | 'light' | 'medium')}
            >
              <option value="none">{tx('Straight')}</option>
              <option value="light">{tx('Light swing')}</option>
              <option value="medium">{tx('Medium swing')}</option>
            </select>
          </label>
          <label className="block text-xs text-[var(--text-muted)]">
            {tx('Fret position')}
            <select
              className="input mt-1"
              value={preferPosition}
              disabled={busy}
              onChange={(e) => setPreferPosition(e.target.value as 'auto' | 'open' | 'mid')}
            >
              <option value="auto">{tx('Auto continuity')}</option>
              <option value="open">{tx('Prefer open (0–5)')}</option>
              <option value="mid">{tx('Prefer mid (5–7)')}</option>
            </select>
          </label>
        </div>
      </div>

      <div
        className={`card p-8 border-dashed border-2 text-center transition-colors ${
          drag ? 'border-mint bg-mint/5' : 'border-[var(--border)]'
        }`}
        onDragOver={(e) => {
          e.preventDefault()
          setDrag(true)
        }}
        onDragLeave={() => setDrag(false)}
        onDrop={(e) => {
          e.preventDefault()
          setDrag(false)
          const f = e.dataTransfer.files?.[0]
          if (f) void runFile(f)
        }}
      >
        <FileUp className="w-10 h-10 text-mint mx-auto mb-3" />
        <p className="font-medium">{tx('Drop audio here to convert')}</p>
        <p className="text-sm text-[var(--text-muted)] mt-1 mb-4">
          {tx('Audio: ')}
          <span className="text-mint">{AUDIO_FORMATS_LABEL}</span>
          {tx(' → MIDI → tabs (Basic Pitch Apache-2.0 when the free model loads, else autocorrelation). Also: .mid · .midi · .musicxml · .mxl · .gp / .gp3–5 / .gpx / .gp7 / .gpif · .grtab.json (GP binary often needs MIDI/MusicXML export).')}
        </p>
        <label
          className={`btn-primary inline-flex cursor-pointer ${busy ? 'opacity-70 pointer-events-none' : ''}`}
        >
          {busy ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" /> {tx('Converting…')}
            </>
          ) : (
            <>
              <Guitar className="w-4 h-4" /> {tx('Choose audio or MIDI')}
            </>
          )}
          <input
            type="file"
            className="hidden"
            accept={UPLOAD_ACCEPT}
            onChange={onInput}
            disabled={busy}
          />
        </label>
        {status && (
          <p className="mt-3 text-xs font-mono text-mint/90" role="status" aria-live="polite">
            {busy && <Loader2 className="w-3 h-3 inline animate-spin mr-1.5 -mt-0.5" />}
            {status}
          </p>
        )}
      </div>

      {error && (
        <div className="card p-4 border-red-500/30 text-red-300 text-sm flex gap-2">
          <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
          {error}
        </div>
      )}

      {breakdown && (
        <div className="space-y-4">
          <div className="card p-5">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-mint/15 flex items-center justify-center shrink-0">
                <Sparkles className="w-5 h-5 text-mint" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-start gap-2 justify-between">
                  <div className="min-w-0">
                    <h2 className="font-display font-bold text-lg">{breakdown.title}</h2>
                    <p className="text-sm text-[var(--text-muted)] mt-0.5">
                      {breakdown.keyLabel}
                      {breakdown.timeSig
                        ? tx(' · {num}/{den}', {
                            num: breakdown.timeSig[0],
                            den: breakdown.timeSig[1],
                          })
                        : ''}{' '}
                      {tx('· ranking {pct}%', { pct: Math.round(breakdown.confidence * 100) })}
                      <span className="text-[var(--text-muted)]/80">
                        {tx(' (sort only — not fret/rhythm accuracy)')}
                      </span>{' '}
                      {breakdown.kind === 'audio'
                        ? tx('· audio→MIDI→tabs (draft)')
                        : tx('· {kind}', { kind: breakdown.kind })}
                      {breakdown.editable ? tx(' · editable') : ''}
                      {breakdown.tempoBpm ? tx(' · ♩={bpm}', { bpm: breakdown.tempoBpm }) : ''}
                      {breakdown.detectedTempoBpm &&
                      breakdown.detectedTempoBpm !== breakdown.tempoBpm
                        ? tx(' (detected {bpm})', { bpm: breakdown.detectedTempoBpm })
                        : ''}
                      {breakdown.analyzedSec
                        ? tx(' · {sec}s analyzed', { sec: breakdown.analyzedSec.toFixed(0) })
                        : ''}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2 shrink-0">
                    <button
                      type="button"
                      className="btn-secondary text-xs"
                      onClick={onDownloadMidi}
                      title={tx('MIDI with embedded tempo for truthful re-import')}
                    >
                      <Download className="w-3.5 h-3.5" />
                      {tx('MIDI')}
                    </button>
                    <button type="button" className="btn-secondary text-xs" onClick={onExportTabFile}>
                      <FileDown className="w-3.5 h-3.5" />
                      {tx('Export .grtab')}
                    </button>
                    <button type="button" className="btn-ghost text-xs" onClick={onExportAscii}>
                      {tx('ASCII tab')}
                    </button>
                  </div>
                </div>
                {savedTab && persistError ? (
                  <p role="alert" className="mt-3 rounded-xl border border-rose/25 bg-rose/10 px-3 py-2 text-sm text-rose/90">
                    {persistError}
                  </p>
                ) : null}
                {savedTab && !persistError && (
                  <div className="mt-3 flex flex-wrap items-center gap-2 rounded-xl border border-mint/30 bg-mint/10 px-3 py-2 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-mint shrink-0" />
                    <span className="text-mint font-medium min-w-0 break-words">
                      {tx('Saved to Your tabs · {title}', { title: savedTab.title })}
                    </span>
                    <Link to="/library?mine=1" className="btn-primary !py-1 !px-2.5 text-xs ml-auto">
                      <Library className="w-3.5 h-3.5" />
                      {tx('Open in Library')}
                    </Link>
                    <button type="button" className="btn-ghost !py-1 !px-2 text-xs" onClick={onSaveAgain}>
                      <Save className="w-3.5 h-3.5" />
                      {tx('Save copy')}
                    </button>
                  </div>
                )}
                {breakdown.warnings.length > 0 && (
                  <ul className="mt-2 text-xs text-mint/90 space-y-1">
                    {breakdown.warnings.map((w) => (
                      <li key={w}>⚠ {w}</li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
            <div className="mt-4 grid md:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="section-title mb-2">{tx('What Remedy did')}</p>
                <ul className="space-y-1.5 text-[var(--text-muted)]">
                  {breakdown.explanation.map((line) => (
                    <li key={line}>• {line}</li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="section-title mb-2">{tx('Practice plan')}</p>
                <ol className="space-y-1.5 text-[var(--text-muted)] list-decimal list-inside">
                  {breakdown.practicePlan.map((line) => (
                    <li key={line}>{line}</li>
                  ))}
                </ol>
              </div>
            </div>
          </div>

          <div className="card p-4 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="section-title mb-0">{tx('Guitar tabs')}</p>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  className={editing ? 'btn-secondary text-xs' : 'btn-ghost text-xs'}
                  onClick={() => setEditing((v) => !v)}
                >
                  <Pencil className="w-3.5 h-3.5" />
                  {editing ? tx('Close editor') : tx('Edit tab')}
                </button>
                <button type="button" className="btn-ghost text-xs" onClick={onSaveAgain}>
                  <Save className="w-3.5 h-3.5" />
                  {tx('Save to Your tabs')}
                </button>
              </div>
            </div>
            {stemDrafts.length > 0 ? (
              <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)]/40 p-3 text-xs">
                <p className="section-title mb-2">{tx('Per-stem drafts (compare)')}</p>
                <ul className="space-y-1 text-[var(--text-muted)]">
                  {stemDrafts.map((d) => (
                    <li key={d.stem} className="flex justify-between gap-2 font-mono">
                      <span className="text-mint">{d.stem}</span>
                      <span>
                        {tx('score {score} · {count} notes', {
                          score: d.score.toFixed(1),
                          count: d.noteCount,
                        })}
                      </span>
                    </li>
                  ))}
                </ul>
                <p className="text-[10px] mt-2 opacity-80">
                  {tx('Main tab used the winning stem/engine race. Re-convert with a forced stem if another draft looks cleaner.')}
                  {sourceArrayBuffer ? tx(' Source bytes kept for re-runs this session.') : ''}
                </p>
              </div>
            ) : null}
            {editing ? (
              <TabEditor
                key={`${breakdown.title}-${breakdown.tabNotes.length}-${savedTab?.id ?? 'new'}`}
                score={toScore(breakdown)}
                title={breakdown.title}
                sourceAudioUrl={sourceAudioUrl}
                onSave={onEditorSave}
                onCancel={() => setEditing(false)}
              />
            ) : (
              <TabView score={toScore(breakdown)} />
            )}
          </div>

          <div className="card p-4">
            <p className="section-title mb-3">
              {tx('Scale map — {root} {scale}', { root: breakdown.key.root, scale: scale.name })}
            </p>
            <Fretboard root={root} scale={scale} />
          </div>
        </div>
      )}
    </div>
  )
}
