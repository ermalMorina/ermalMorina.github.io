export type Quality = 'high' | 'low'
export type ViewMode = '3d' | '2d'

export type DevicePref = {
  mode: ViewMode
  quality: Quality
  reason: string
}

type NavigatorWithHints = Navigator & {
  deviceMemory?: number
  connection?: { saveData?: boolean; effectiveType?: string }
}

export function canUseWebGL(): boolean {
  try {
    const canvas = document.createElement('canvas')
    return Boolean(canvas.getContext('webgl2') || canvas.getContext('webgl'))
  } catch {
    return false
  }
}

export function detectPreferredMode(): DevicePref {
  if (typeof window === 'undefined') {
    return { mode: '3d', quality: 'high', reason: 'ssr' }
  }

  if (!canUseWebGL()) {
    return { mode: '2d', quality: 'low', reason: 'no-webgl' }
  }

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return { mode: '2d', quality: 'low', reason: 'reduced-motion' }
  }

  const nav = navigator as NavigatorWithHints
  const mobile =
    window.matchMedia('(max-width: 820px)').matches ||
    /Mobi|Android|iPhone|iPad/i.test(nav.userAgent)
  const saveData = Boolean(nav.connection?.saveData)
  const slowNet = nav.connection?.effectiveType === '2g' || nav.connection?.effectiveType === 'slow-2g'

  if (saveData || slowNet) {
    return { mode: '2d', quality: 'low', reason: 'save-data' }
  }

  if (mobile) {
    return { mode: '2d', quality: 'low', reason: 'mobile' }
  }

  return { mode: '3d', quality: 'high', reason: 'desktop' }
}
