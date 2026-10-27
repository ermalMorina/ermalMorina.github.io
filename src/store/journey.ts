import { create } from 'zustand'
import { clamp, damp } from '../lib/math'
import type { Quality, ViewMode } from '../lib/device'

type JourneyState = {
  target: number
  progress: number
  speed: number
  lane: number
  laneTarget: number
  mode: ViewMode
  quality: Quality
  loaded: boolean
  bootstrapped: boolean
  hintVisible: boolean
  setTarget: (t: number) => void
  nudgeTarget: (delta: number) => void
  setLaneTarget: (v: number) => void
  tick: (dt: number) => void
  setMode: (mode: ViewMode) => void
  setQuality: (quality: Quality) => void
  setLoaded: (loaded: boolean) => void
  setBootstrapped: (bootstrapped: boolean) => void
  dismissHint: () => void
}

export const useJourney = create<JourneyState>((set, get) => ({
  target: 0,
  progress: 0,
  speed: 0,
  lane: 0,
  laneTarget: 0,
  mode: '3d',
  quality: 'high',
  loaded: false,
  bootstrapped: false,
  hintVisible: true,
  setTarget: (t) => set({ target: clamp(t, 0, 1) }),
  nudgeTarget: (delta) => set({ target: clamp(get().target + delta, 0, 1) }),
  setLaneTarget: (v) => set({ laneTarget: clamp(v, -1, 1) }),
  tick: (dt) => {
    const { target, progress, lane, laneTarget } = get()
    const next = damp(progress, target, 3.4, dt)
    const nextLane = damp(lane, laneTarget, 7, dt)
    set({
      progress: next,
      lane: nextLane,
      speed: (next - progress) / Math.max(dt, 1 / 120),
    })
  },
  setMode: (mode) => set({ mode, hintVisible: mode === '3d' }),
  setQuality: (quality) => set({ quality }),
  setLoaded: (loaded) => set({ loaded }),
  setBootstrapped: (bootstrapped) => set({ bootstrapped }),
  dismissHint: () => set({ hintVisible: false }),
}))
