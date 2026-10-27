import { AdaptiveDpr } from '@react-three/drei'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { getSectionBlend } from '../content/cv'
import { useJourney } from '../store/journey'
import { CameraRig } from './CameraRig'
import { Car } from './Car'
import { Effects } from './Effects'
import { Landmarks } from './Landmarks'
import { Road } from './Road'
import { World } from './World'

const fogColor = new THREE.Color('#1a0524')
const fogTarget = new THREE.Color()
const fromColor = new THREE.Color()
const toColor = new THREE.Color()
const ambientTarget = new THREE.Color()

function JourneyTicker() {
  useFrame((_, dt) => {
    useJourney.getState().tick(dt)
  })
  return null
}

function ThemeController() {
  const { scene } = useThree()

  useFrame((_, dt) => {
    const { progress } = useJourney.getState()
    const { from, to, mix } = getSectionBlend(progress)
    fromColor.set(from.theme.fog)
    toColor.set(to.theme.fog)
    fogTarget.copy(fromColor).lerp(toColor, mix)
    fromColor.set(from.theme.ambient)
    toColor.set(to.theme.ambient)
    ambientTarget.copy(fromColor).lerp(toColor, mix)
    fogColor.lerp(fogTarget, 1 - Math.exp(-dt * 1.8))
    if (scene.fog) scene.fog.color.copy(fogColor)
    scene.background = fogColor
    const hemi = scene.children.find((c) => c.type === 'HemisphereLight') as THREE.HemisphereLight | undefined
    if (hemi) hemi.color.lerp(ambientTarget, 1 - Math.exp(-dt * 1.8))
  })

  return null
}

export function Experience() {
  const quality = useJourney((s) => s.quality)

  return (
    <>
      <color attach="background" args={['#05010d']} />
      <fogExp2 attach="fog" args={['#1a0524', 0.014]} />
      <AdaptiveDpr pixelated />
      <JourneyTicker />
      <ThemeController />
      <CameraRig />
      <World />
      <Road />
      <Landmarks />
      <Car />
      <Effects quality={quality} />
    </>
  )
}
