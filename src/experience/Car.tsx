import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { PATH_LENGTH, samplePath } from '../lib/path'
import { useJourney } from '../store/journey'

const _pos = new THREE.Vector3()
const _quat = new THREE.Quaternion()
const _tangent = new THREE.Vector3()
const _side = new THREE.Vector3()
const _euler = new THREE.Euler()

function Wheel({ position }: { position: [number, number, number] }) {
  const ref = useRef<THREE.Group>(null)

  useFrame(() => {
    const wheel = ref.current
    if (!wheel) return
    const { progress, speed } = useJourney.getState()
    wheel.rotation.x = progress * (PATH_LENGTH / 0.32) * Math.sign(speed || 1)
  })

  return (
    <group ref={ref} position={position} rotation={[0, 0, Math.PI / 2]}>
      <mesh>
        <cylinderGeometry args={[0.32, 0.32, 0.22, 16]} />
        <meshStandardMaterial color="#111015" roughness={0.55} metalness={0.4} />
      </mesh>
      <mesh>
        <cylinderGeometry args={[0.18, 0.18, 0.24, 12]} />
        <meshStandardMaterial color="#8aa0c8" roughness={0.25} metalness={0.85} />
      </mesh>
      <mesh>
        <cylinderGeometry args={[0.06, 0.06, 0.26, 8]} />
        <meshStandardMaterial
          color="#00f0ff"
          emissive="#00f0ff"
          emissiveIntensity={1.4}
          toneMapped={false}
        />
      </mesh>
    </group>
  )
}

export function Car() {
  const group = useRef<THREE.Group>(null)
  const bodyMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#3a1248',
        metalness: 0.62,
        roughness: 0.32,
        envMapIntensity: 1.2,
      }),
    [],
  )

  useFrame((state) => {
    const car = group.current
    if (!car) return
    const { progress, lane, speed } = useJourney.getState()
    samplePath(progress, _pos, _quat, _tangent, _side)
    _pos.addScaledVector(_side, lane * 1.15)
    _pos.y += 0.38 + Math.sin(state.clock.elapsedTime * 9) * Math.min(0.05, Math.abs(speed) * 0.4)
    car.position.copy(_pos)
    _euler.setFromQuaternion(_quat)
    _euler.z += -lane * 0.12 + Math.sin(state.clock.elapsedTime * 6) * Math.abs(speed) * 0.15
    car.quaternion.setFromEuler(_euler)
  })

  return (
    <group ref={group}>
      <mesh position={[0, 0.18, 0]} material={bodyMat} castShadow={false}>
        <boxGeometry args={[1.7, 0.28, 3.9]} />
      </mesh>
      <mesh position={[0, 0.38, -0.15]} material={bodyMat}>
        <boxGeometry args={[1.86, 0.22, 4.15]} />
      </mesh>
      <mesh position={[0, 0.62, 0.15]} material={bodyMat}>
        <boxGeometry args={[1.55, 0.28, 2.4]} />
      </mesh>
      <mesh position={[0, 0.86, 0.35]} rotation={[0.12, 0, 0]}>
        <boxGeometry args={[1.42, 0.42, 1.55]} />
        <meshStandardMaterial color="#09040f" metalness={0.4} roughness={0.15} />
      </mesh>
      <mesh position={[0, 0.84, -0.42]} rotation={[0.48, 0, 0]}>
        <boxGeometry args={[1.36, 0.04, 0.9]} />
        <meshPhysicalMaterial
          color="#14324a"
          metalness={0.2}
          roughness={0.05}
          transmission={0.35}
          thickness={0.4}
          transparent
          opacity={0.85}
        />
      </mesh>

      <mesh position={[0, 0.08, 0]}>
        <boxGeometry args={[1.7, 0.04, 3.7]} />
        <meshBasicMaterial color="#ff2bd6" toneMapped={false} />
      </mesh>
      <mesh position={[-0.94, 0.42, -0.1]}>
        <boxGeometry args={[0.04, 0.08, 3.6]} />
        <meshBasicMaterial color="#00f0ff" toneMapped={false} />
      </mesh>
      <mesh position={[0.94, 0.42, -0.1]}>
        <boxGeometry args={[0.04, 0.08, 3.6]} />
        <meshBasicMaterial color="#00f0ff" toneMapped={false} />
      </mesh>

      <mesh position={[-0.55, 0.42, -2.08]}>
        <boxGeometry args={[0.38, 0.14, 0.08]} />
        <meshBasicMaterial color="#e8fbff" toneMapped={false} />
      </mesh>
      <mesh position={[0.55, 0.42, -2.08]}>
        <boxGeometry args={[0.38, 0.14, 0.08]} />
        <meshBasicMaterial color="#e8fbff" toneMapped={false} />
      </mesh>
      <mesh position={[-0.55, 0.44, 2.04]}>
        <boxGeometry args={[0.42, 0.1, 0.06]} />
        <meshBasicMaterial color="#ff2b64" toneMapped={false} />
      </mesh>
      <mesh position={[0.55, 0.44, 2.04]}>
        <boxGeometry args={[0.42, 0.1, 0.06]} />
        <meshBasicMaterial color="#ff2b64" toneMapped={false} />
      </mesh>

      <mesh position={[0, 0.72, 1.55]} material={bodyMat}>
        <boxGeometry args={[1.5, 0.08, 0.32]} />
      </mesh>

      <Wheel position={[-0.86, 0.32, -1.28]} />
      <Wheel position={[0.86, 0.32, -1.28]} />
      <Wheel position={[-0.86, 0.32, 1.32]} />
      <Wheel position={[0.86, 0.32, 1.32]} />

      <spotLight
        position={[-0.5, 0.5, -2.1]}
        angle={0.42}
        penumbra={0.45}
        intensity={28}
        distance={36}
        color="#c8f7ff"
        decay={1.6}
      />
      <spotLight
        position={[0.5, 0.5, -2.1]}
        angle={0.42}
        penumbra={0.45}
        intensity={28}
        distance={36}
        color="#c8f7ff"
        decay={1.6}
      />
      <pointLight position={[0, 0.1, 0]} intensity={6} distance={8} color="#ff2bd6" />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.34, 0]}>
        <circleGeometry args={[1.7, 16]} />
        <meshBasicMaterial color="#000000" transparent opacity={0.45} />
      </mesh>
    </group>
  )
}
