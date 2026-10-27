import { lazy, Suspense, useEffect } from 'react'
import { useJourneyControls } from './hooks/useJourneyControls'
import { detectPreferredMode } from './lib/device'
import { useJourney } from './store/journey'
import { Fallback2D } from './ui/Fallback2D'
import { Hud } from './ui/Hud'
import { LoadingScreen } from './ui/LoadingScreen'

const WorldCanvas = lazy(() => import('./experience/WorldCanvas'))

export default function App() {
  const mode = useJourney((s) => s.mode)
  const bootstrapped = useJourney((s) => s.bootstrapped)

  useEffect(() => {
    const pref = detectPreferredMode()
    useJourney.setState({
      mode: pref.mode,
      quality: pref.quality,
      bootstrapped: true,
      loaded: pref.mode === '2d',
    })
  }, [])

  useJourneyControls()

  useEffect(() => {
    if (mode !== '3d') return
    const onError = () => useJourney.getState().setMode('2d')
    window.addEventListener('webglcontextlost', onError)
    return () => window.removeEventListener('webglcontextlost', onError)
  }, [mode])

  if (!bootstrapped) {
    return <LoadingScreen />
  }

  if (mode === '2d') {
    return (
      <>
        <a className="skip" href="#readable">
          Skip to readable resume
        </a>
        <Fallback2D />
      </>
    )
  }

  return (
    <>
      <a
        className="skip"
        href="#readable"
        onClick={(event) => {
          event.preventDefault()
          useJourney.getState().setMode('2d')
        }}
      >
        Skip to readable resume
      </a>
      <div className="stage">
        <Suspense fallback={null}>
          <WorldCanvas />
        </Suspense>
      </div>
      <Hud />
      <div className="scroll-track" aria-hidden="true" />
      <LoadingScreen />
    </>
  )
}
