import { useCallback, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  FileUp,
  AlertTriangle,
  Sparkles,
  Music2,
  Download,
  Loader2,
  AudioLines,
  Guitar,
  Save,
  Library,
  CheckCircle2,
  FileDown,
  Pencil,
} from 'lucide-react'
import {
  analyzeNotes,
  AUDIO_FORMATS_LABEL,
  isAudioUpload,
  parseUploadedFile,
  setSessionTuning,
  UPLOAD_ACCEPT,
  type ConvertStage,
  type RemedyBreakdown,
  type TabScore,
} from '../lib/breakdown'
import { setEditorTuning } from '../lib/tabEdit'
import { buildSimpleMidi } from '../lib/midi'
import { downloadMidiBytes } from '../lib/audioToMidi'
import {
  downloadAsciiTab,
  downloadUserTabFile,
  type UserTab,
} from '../lib/userTabs'
import { TabView } from '../components/TabView'
import { TabEditor } from '../components/TabEditor'
import { Fretboard } from '../components/Fretboard'
import { SCALES, noteToPc } from '../lib/theory'
import { applyScoreToBreakdown } from '../lib/tabEdit'
import { useAppStore } from '../store/appStore'
import { useUserTabsStore } from '../store/userTabsStore'
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

const PIPELINE_STEPS: { id: ConvertStage; label: string }[] = [
  { id: 'decode', label: '1. Decode audio' },
  { id: 'audio_to_midi', label: '2. Audio to MIDI' },
  { id: 'midi_to_tabs', label: '3. MIDI to tabs' },
]

function stageIndex(stage: ConvertStage | null): number {
  if (!stage || stage === 'idle') return -1
  if (stage === 'done') return 3
  if (stage === 'error') return -2
  return PIPELINE_STEPS.findIndex((s) => s.id === stage)
}

export function UploadPage() {
  const recordPractice = useAppStore((s) => s.recordPractice)
  const getTuning = useAppStore((s) => s.getTuning)
  const a4 = useAppStore((s) => s.a4)
  const saveFromBreakdown = useUserTabsStore((s) => s.saveFromBreakdown)
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
  const [sourceAudioUrl, setSourceAudioUrl] = useState<string | null>(null)
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
      if (sourceAudioUrl) {
        URL.revokeObjectURL(sourceAudioUrl)
        setSourceAudioUrl(null)
      }
      const audio = isAudioUpload(file)
      if (audio) {
        setSourceAudioUrl(URL.createObjectURL(file))
      }
      setStage(audio ? 'decode' : 'midi_to_tabs')
      setStatus(audio ? '1/3 Decoding audio…' : `Parsing ${file.name}…`)
      try {
        // Fretting + editor cleanup follow Profile tuning (Drop D, custom, …).
        const tuning = getTuning()
        setSessionTuning(tuning)
        setEditorTuning(tuning)
        const b = await parseUploadedFile(file, {
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
          // Explicit tuning on every path — not only module session side-effect.
          tuning,
        })
        setBreakdown(b)
        setStage(b.kind === 'unknown' ? 'error' : 'done')
        const saved = persistBreakdown(b, file.name)
        if (saved) {
          setStatus(
            `${b.statusMessage ?? `Ready · ${b.tabNotes.length} notes`} · saved to Your tabs`,
          )
        } else {
          setStatus(b.statusMessage ?? `Ready · ${b.tabNotes.length} notes`)
        }
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Could not parse file')
        setBreakdown(null)
        setSavedTab(null)
        setStage('error')
        setStatus(null)
      } finally {
        setBusy(false)
      }
    },
    [persistBreakdown, sourceAudioUrl, tempoOverride, trimSec, stem, getTuning, a4],
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
      setError(e instanceof Error ? e.message : 'Could not open file')
      setStage('error')
    }
  }, [runFile])

  const demoMidi = () => {
    const events = [
      { pitch: 60, start: 0, duration: 240 },
      { pitch: 64, start: 240, duration: 240 },
      { pitch: 67, start: 480, duration: 240 },
      { pitch: 72, start: 720, duration: 480 },
      { pitch: 71, start: 1200, duration: 240 },
      { pitch: 69, start: 1440, duration: 240 },
      { pitch: 67, start: 1680, duration: 480 },
    ]
    const midiBytes = buildSimpleMidi(events)
    const midis = events.map((e) => e.pitch)
    const b = analyzeNotes(midis, 'Demo C major arpeggio')
    // score/tabNotes already in beats via analyzeNotes → eventsToNotes
    b.midiBytes = midiBytes
    b.statusMessage = 'Demo · MIDI → tabs'
    b.kind = 'midi'
    setError(null)
    setStage('done')
    setBreakdown(b)
    const saved = persistBreakdown(b, 'demo-midi.mid')
    setStatus(saved ? `${b.statusMessage} · saved to Your tabs` : b.statusMessage)
  }

  const demoMp3Pipeline = () => {
    // Synthetic monophonic “recording” already as MIDI notes — shows full pipeline labels
    const pitches = [57, 60, 62, 64, 67, 69, 72, 69, 67, 64, 62, 60]
    const midiBytes = buildSimpleMidi(
      pitches.map((pitch, i) => ({
        pitch,
        start: i * 240,
        duration: 220,
      })),
    )
    const b = analyzeNotes(pitches, 'demo-melody.mp3')
    b.kind = 'audio'
    b.midiBytes = midiBytes
    // keep beat-based score from analyzeNotes (no *0.5 seconds hack)
    b.confidence = 0.48
    b.editable = true
    b.warnings = [
      'Demo of the MP3 → MIDI → tabs pipeline (synthetic pitches).',
      'Real uploads decode audio, pitch-track to MIDI, then fret tabs.',
    ]
    b.explanation = [
      '1) Decoded demo-melody.mp3 (synthetic).',
      `2) MP3→MIDI locked ${pitches.length} monophonic notes → downloadable .mid.`,
      '3) MIDI→tabs fretted in your Profile / session tuning (not always standard).',
      'Upload a real monophonic or lead-forward MP3 for the live converter — full-band mixes stay drafts.',
    ]
    b.practicePlan = [
      'Drop a clean single-note MP3 to run the real pitch tracker.',
      'Download MIDI, edit in a DAW if needed, re-upload .mid for solid tabs.',
      'Always confirm frets by ear before practicing.',
    ]
    b.statusMessage = `MP3 → MIDI → tabs · ${pitches.length} notes (demo)`
    setError(null)
    setStage('done')
    setBreakdown(b)
    const saved = persistBreakdown(b, 'demo-melody.mp3')
    setStatus(saved ? `${b.statusMessage} · saved to Your tabs` : b.statusMessage)
  }

  const onDownloadMidi = () => {
    if (!breakdown?.midiBytes) return
    const base = (breakdown.title || 'converted').replace(/[^\w\-]+/g, '_').slice(0, 48)
    downloadMidiBytes(breakdown.midiBytes, `${base}.mid`)
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
    if (tab) setStatus(`Saved “${tab.title}” to Your tabs`)
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
        ? `Edits saved · “${tab.title}” · ${score.notes.length} notes`
        : `Edits applied · ${score.notes.length} notes`,
    )
  }

  const scaleId = breakdown?.scaleId || 'major'
  const scale = SCALES[scaleId] || SCALES.major
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
          <p className="section-title">Upload</p>
          <h1 className="font-display text-3xl font-bold tracking-tight mt-1">Song → tabs</h1>
          <p className="text-[var(--text-muted)] mt-2 text-sm max-w-2xl leading-relaxed">
            Drop an <strong className="text-mint font-medium">MP3 / WAV</strong> and Remedy runs a
            clean three-step converter: <span className="text-[var(--text)]">decode audio</span> →{' '}
            <span className="text-[var(--text)]">audio to MIDI</span> →{' '}
            <span className="text-[var(--text)]">MIDI to guitar tabs</span>. MIDI and MusicXML are
            the solid structured path. Guitar Pro is best-effort (placeholders never auto-save).
            Audio is a monophonic / lead-biased draft — always editable, never a perfect full-band
            auto-tab.
          </p>
        </div>
      </div>

      {/* Pipeline strip */}
      <div className="card p-4">
        <p className="section-title mb-3">Converter pipeline</p>
        <ol className="grid sm:grid-cols-3 gap-2">
          {PIPELINE_STEPS.map((step, i) => {
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
          <AudioLines className="w-3.5 h-3.5 inline mr-1 text-mint" />
          Best results: dry single-note melody (no heavy drums/chords). Full-band mixes default to{' '}
          <strong className="text-[var(--text)]">Auto stem</strong> (races lead / harmonic / mix via
          HPSS) for a monophonic draft — always edit by ear. Prefer MIDI/MusicXML when you have them.
        </p>
        <div className="mt-4 grid sm:grid-cols-3 gap-3">
          <label className="block text-xs text-[var(--text-muted)]">
            Tempo override (BPM)
            <input
              type="number"
              min={0}
              max={300}
              className="input mt-1"
              value={tempoOverride || ''}
              placeholder="Auto-detect"
              disabled={busy}
              onChange={(e) => setTempoOverride(Math.max(0, Number(e.target.value) || 0))}
            />
            <span className="text-[10px] opacity-80">0 or empty = detect from audio</span>
          </label>
          <label className="block text-xs text-[var(--text-muted)]">
            Analyze first (seconds)
            <input
              type="number"
              min={0}
              max={600}
              className="input mt-1"
              value={trimSec}
              disabled={busy}
              onChange={(e) => setTrimSec(Math.max(0, Number(e.target.value) || 0))}
            />
            <span className="text-[10px] opacity-80">0 = full file · default 90s for long mixes</span>
          </label>
          <label className="block text-xs text-[var(--text-muted)]">
            Full-band stem (HPSS)
            <select
              className="input mt-1"
              value={stem}
              disabled={busy}
              onChange={(e) =>
                setStem(e.target.value as 'auto' | 'lead' | 'harmonic' | 'mix')
              }
            >
              <option value="auto">Auto (default · race stems)</option>
              <option value="lead">Lead only</option>
              <option value="harmonic">Harmonic only</option>
              <option value="mix">Full mix (no HPSS · harder)</option>
            </select>
            <span className="text-[10px] opacity-80">
              Auto picks the cleanest monophonic track from lead / harmonic / mix
            </span>
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
        <p className="font-medium">Drop audio here to convert</p>
        <p className="text-sm text-[var(--text-muted)] mt-1 mb-4">
          Audio: <span className="text-mint">{AUDIO_FORMATS_LABEL}</span> → MIDI → tabs · Also:
          .mid · .musicxml · .gp / .gpx / .gpif (GP binary often needs MIDI/MusicXML export)
        </p>
        <label
          className={`btn-primary inline-flex cursor-pointer ${busy ? 'opacity-70 pointer-events-none' : ''}`}
        >
          {busy ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" /> Converting…
            </>
          ) : (
            <>
              <Guitar className="w-4 h-4" /> Choose audio or MIDI
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
        <div className="flex flex-wrap justify-center gap-2 mt-4">
          <button type="button" className="btn-secondary text-xs" onClick={demoMidi} disabled={busy}>
            <Music2 className="w-3.5 h-3.5" /> Demo MIDI → tabs
          </button>
          <button
            type="button"
            className="btn-ghost text-xs"
            onClick={demoMp3Pipeline}
            disabled={busy}
          >
            <AudioLines className="w-3.5 h-3.5" /> Demo MP3 → MIDI → tabs
          </button>
        </div>
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
                        ? ` · ${breakdown.timeSig[0]}/${breakdown.timeSig[1]}`
                        : ''}{' '}
                      · ranking {Math.round(breakdown.confidence * 100)}%
                      <span className="text-[var(--text-muted)]/80">
                        {' '}
                        (sort only — not fret/rhythm accuracy)
                      </span>{' '}
                      · {breakdown.kind === 'audio' ? 'audio→MIDI→tabs (draft)' : breakdown.kind}
                      {breakdown.editable ? ' · editable' : ''}
                      {breakdown.tempoBpm ? ` · ♩=${breakdown.tempoBpm}` : ''}
                      {breakdown.detectedTempoBpm &&
                      breakdown.detectedTempoBpm !== breakdown.tempoBpm
                        ? ` (detected ${breakdown.detectedTempoBpm})`
                        : ''}
                      {breakdown.analyzedSec
                        ? ` · ${breakdown.analyzedSec.toFixed(0)}s analyzed`
                        : ''}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2 shrink-0">
                    {breakdown.midiBytes && (
                      <button
                        type="button"
                        className="btn-secondary text-xs"
                        onClick={onDownloadMidi}
                      >
                        <Download className="w-3.5 h-3.5" />
                        MIDI
                      </button>
                    )}
                    <button type="button" className="btn-secondary text-xs" onClick={onExportTabFile}>
                      <FileDown className="w-3.5 h-3.5" />
                      Export .grtab
                    </button>
                    <button type="button" className="btn-ghost text-xs" onClick={onExportAscii}>
                      ASCII tab
                    </button>
                  </div>
                </div>
                {savedTab && (
                  <div className="mt-3 flex flex-wrap items-center gap-2 rounded-xl border border-mint/30 bg-mint/10 px-3 py-2 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-mint shrink-0" />
                    <span className="text-mint font-medium min-w-0 truncate">
                      Saved to Your tabs · {savedTab.title}
                    </span>
                    <Link to="/library?mine=1" className="btn-primary !py-1 !px-2.5 text-xs ml-auto">
                      <Library className="w-3.5 h-3.5" />
                      Open in Library
                    </Link>
                    <button type="button" className="btn-ghost !py-1 !px-2 text-xs" onClick={onSaveAgain}>
                      <Save className="w-3.5 h-3.5" />
                      Save copy
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
                <p className="section-title mb-2">What Remedy did</p>
                <ul className="space-y-1.5 text-[var(--text-muted)]">
                  {breakdown.explanation.map((line) => (
                    <li key={line}>• {line}</li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="section-title mb-2">Practice plan</p>
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
              <p className="section-title mb-0">Guitar tabs</p>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  className={editing ? 'btn-secondary text-xs' : 'btn-ghost text-xs'}
                  onClick={() => setEditing((v) => !v)}
                >
                  <Pencil className="w-3.5 h-3.5" />
                  {editing ? 'Close editor' : 'Edit tab'}
                </button>
                <button type="button" className="btn-ghost text-xs" onClick={onSaveAgain}>
                  <Save className="w-3.5 h-3.5" />
                  Save to Your tabs
                </button>
              </div>
            </div>
            {editing ? (
              <TabEditor
                key={`${breakdown.title}-${breakdown.tabNotes.length}-${savedTab?.id ?? 'new'}`}
                score={toScore(breakdown)}
                title={breakdown.title}
                onSave={onEditorSave}
                onCancel={() => setEditing(false)}
              />
            ) : (
              <TabView score={toScore(breakdown)} />
            )}
          </div>

          <div className="card p-4">
            <p className="section-title mb-3">
              Scale map — {breakdown.key.root} {scale.name}
            </p>
            <Fretboard root={root} scale={scale} />
          </div>
        </div>
      )}
    </div>
  )
}
