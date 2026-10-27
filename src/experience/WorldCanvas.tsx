import { Canvas } from '@react-three/fiber'
import { Suspense } from 'react'
import { useJourney } from '../store/journey'
import { Experience } from './Experience'

export default function WorldCanvas() {
  const quality = useJourney((s) => s.quality)

  return (
    <Canvas
      dpr={quality === 'high' ? [1, 1.5] : [1, 1]}
      gl={{
        antialias: quality === 'high',
        powerPreference: 'high-performance',
        stencil: false,
        alpha: false,
      }}
      camera={{ fov: 52, near: 0.1, far: 520, position: [0, 3.4, -14] }}
      style={{ pointerEvents: 'none' }}
      onCreated={({ gl }) => {
        gl.setClearColor('#05010d')
        useJourney.getState().setLoaded(true)
      }}
    >
      <Suspense fallback={null}>
        <Experience />
      </Suspense>
    </Canvas>
  )
}
