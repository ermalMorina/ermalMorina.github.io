import { useFrame, useThree } from '@react-three/fiber'
import { useRef } from 'react'
import * as THREE from 'three'
import { samplePath } from '../lib/path'
import { damp } from '../lib/math'
import { useJourney } from '../store/journey'

const _pos = new THREE.Vector3()
const _quat = new THREE.Quaternion()
const _tangent = new THREE.Vector3()
const _side = new THREE.Vector3()
const _cam = new THREE.Vector3()
const _look = new THREE.Vector3()
const _ahead = new THREE.Vector3()
const _aheadQ = new THREE.Quaternion()

export function CameraRig() {
  const camera = useThree((s) => s.camera as THREE.PerspectiveCamera)
  const fov = useRef(52)
  const primed = useRef(false)

  useFrame((_, dt) => {
    const { progress, lane, speed } = useJourney.getState()
    samplePath(progress, _pos, _quat, _tangent, _side)
    samplePath(Math.min(0.999, progress + 0.05), _ahead, _aheadQ)

    _cam.copy(_pos)
    _cam.addScaledVector(_tangent, -14.5)
    _cam.addScaledVector(_side, lane * 1.15)
    _cam.y = _pos.y + 3.35

    _look.copy(_pos)
    _look.addScaledVector(_tangent, 18)
    _look.addScaledVector(_side, lane * 0.4)
    _look.y = _pos.y + 1.15

    if (!primed.current) {
      camera.position.copy(_cam)
      camera.up.set(0, 1, 0)
      camera.lookAt(_look)
      primed.current = true
      return
    }

    camera.up.set(0, 1, 0)
    camera.position.lerp(_cam, 1 - Math.exp(-dt * 4.2))
    camera.lookAt(_look)

    const targetFov = 50 + Math.min(8, Math.abs(speed) * 70)
    fov.current = damp(fov.current, targetFov, 2.4, dt)
    camera.fov = fov.current
    camera.updateProjectionMatrix()
  })

  return null
}
