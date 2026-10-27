import { useEffect, useState } from 'react'
import { PROFILE } from '../content/cv'
import { useJourney } from '../store/journey'

export function LoadingScreen() {
  const loaded = useJourney((s) => s.loaded)
  const [pct, setPct] = useState(0)
  const [gone, setGone] = useState(false)

  useEffect(() => {
    let raf = 0
    const start = performance.now()
    const duration = 1500
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration)
      const eased = 1 - Math.pow(1 - t, 3)
      setPct(Math.round(eased * 100))
      if (t < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [])

  useEffect(() => {
    if (!loaded || pct < 100) return
    const t = window.setTimeout(() => setGone(true), 420)
    return () => window.clearTimeout(t)
  }, [loaded, pct])

  if (gone) return null

  return (
    <div className={`loader ${loaded && pct >= 100 ? 'loader--out' : ''}`} role="status" aria-live="polite">
      <div className="loader__horizon" />
      <div className="loader__sun" />
      <div className="loader__road" />
      <div className="loader__car" aria-hidden="true" />
      <p className="loader__kicker">Night circuit · Prishtine</p>
      <h1 className="loader__title">{PROFILE.name}</h1>
      <p className="loader__sub">Igniting the drive through the CV</p>
      <div className="loader__bar" aria-hidden="true">
        <span style={{ width: `${pct}%` }} />
      </div>
      <p className="loader__pct">{pct}%</p>
    </div>
  )
}
