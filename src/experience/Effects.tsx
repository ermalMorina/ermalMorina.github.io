import { Bloom, ChromaticAberration, EffectComposer, Noise, Vignette } from '@react-three/postprocessing'
import { BlendFunction } from 'postprocessing'
import type { Quality } from '../lib/device'

export function Effects({ quality }: { quality: Quality }) {
  if (quality === 'low') return null

  return (
    <EffectComposer enableNormalPass={false} multisampling={0}>
      <Bloom luminanceThreshold={0.28} luminanceSmoothing={0.3} intensity={0.9} mipmapBlur />
      <ChromaticAberration offset={[0.00035, 0.00022]} />
      <Vignette eskil={false} offset={0.18} darkness={0.65} />
      <Noise premultiply blendFunction={BlendFunction.SOFT_LIGHT} opacity={0.18} />
    </EffectComposer>
  )
}
