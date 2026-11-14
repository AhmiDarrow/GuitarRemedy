/**
 * Save a Blob through a temporary <a download>. The object URL is revoked on
 * the next tick, not synchronously: revoking straight after click() can cancel
 * the download in Firefox, Safari, and some Android WebViews.
 */
export function triggerBlobDownload(blob: Blob, filename: string): void {
  if (typeof document === 'undefined') return
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.rel = 'noopener'
  a.style.display = 'none'
  document.body.appendChild(a)
  try {
    a.click()
  } finally {
    a.remove()
    setTimeout(() => URL.revokeObjectURL(url), 1000)
  }
}
