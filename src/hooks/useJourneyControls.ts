import { useEffect } from 'react'
import { SECTIONS } from '../content/cv'
import { useJourney } from '../store/journey'

function syncScrollToTarget(): void {
  const el = document.scrollingElement
  if (!el) return
  const max = el.scrollHeight - el.clientHeight
  el.scrollTop = useJourney.getState().target * Math.max(max, 0)
}

export function jumpToProgress(t: number): void {
  useJourney.getState().setTarget(t)
  syncScrollToTarget()
}

export function jumpToSection(index: number): void {
  const section = SECTIONS[index]
  if (!section) return
  jumpToProgress(section.t)
}

export function useJourneyControls(): void {
  const mode = useJourney((s) => s.mode)

  useEffect(() => {
    if (mode !== '3d') return

    const keys = {
      forward: false,
      back: false,
      left: false,
      right: false,
      boost: false,
    }
    const driving = { active: false }

    const onDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable)) {
        return
      }

      switch (event.code) {
        case 'ArrowUp':
        case 'KeyW':
          keys.forward = true
          event.preventDefault()
          break
        case 'ArrowDown':
        case 'KeyS':
          keys.back = true
          event.preventDefault()
          break
        case 'ArrowLeft':
        case 'KeyA':
          keys.left = true
          break
        case 'ArrowRight':
        case 'KeyD':
          keys.right = true
          break
        case 'ShiftLeft':
        case 'ShiftRight':
          keys.boost = true
          break
        case 'Space': {
          event.preventDefault()
          const { progress } = useJourney.getState()
          const next = SECTIONS.find((s) => s.t > progress + 0.02) ?? SECTIONS[SECTIONS.length - 1]
          jumpToProgress(next.t)
          useJourney.getState().dismissHint()
          break
        }
        default:
          break
      }
    }

    const onUp = (event: KeyboardEvent) => {
      switch (event.code) {
        case 'ArrowUp':
        case 'KeyW':
          keys.forward = false
          break
        case 'ArrowDown':
        case 'KeyS':
          keys.back = false
          break
        case 'ArrowLeft':
        case 'KeyA':
          keys.left = false
          break
        case 'ArrowRight':
        case 'KeyD':
          keys.right = false
          break
        case 'ShiftLeft':
        case 'ShiftRight':
          keys.boost = false
          break
        default:
          break
      }
    }

    let last = performance.now()
    let raf = 0

    const loop = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000)
      last = now
      const accel = (keys.forward ? 1 : 0) - (keys.back ? 1 : 0)
      if (accel !== 0) {
        driving.active = true
        const rate = keys.boost ? 0.07 : 0.034
        useJourney.getState().nudgeTarget(accel * dt * rate)
        syncScrollToTarget()
        useJourney.getState().dismissHint()
      } else {
        driving.active = false
      }
      useJourney.getState().setLaneTarget((keys.right ? 1 : 0) - (keys.left ? 1 : 0))
      raf = requestAnimationFrame(loop)
    }

    const onScroll = () => {
      if (driving.active) return
      const el = document.scrollingElement
      if (!el) return
      const max = el.scrollHeight - el.clientHeight
      useJourney.getState().setTarget(max <= 0 ? 0 : el.scrollTop / max)
    }

    const onWheel = () => {
      useJourney.getState().dismissHint()
    }

    window.addEventListener('keydown', onDown, { passive: false })
    window.addEventListener('keyup', onUp)
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('wheel', onWheel, { passive: true })
    raf = requestAnimationFrame(loop)
    onScroll()

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('keydown', onDown)
      window.removeEventListener('keyup', onUp)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('wheel', onWheel)
    }
  }, [mode])
}
