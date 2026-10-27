import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { getSectionBlend } from '../content/cv'
import { journeyCurve } from '../lib/path'
import { useJourney } from '../store/journey'

const SKY_VERT = /* glsl */ `
  varying vec3 vWorld;
  void main() {
    vec4 world = modelMatrix * vec4(position, 1.0);
    vWorld = world.xyz;
    gl_Position = projectionMatrix * viewMatrix * world;
  }
`

const SKY_FRAG = /* glsl */ `
  varying vec3 vWorld;
  uniform vec3 uZenith;
  uniform vec3 uHorizon;
  uniform vec3 uSunColor;
  uniform vec3 uSunDir;
  void main() {
    vec3 dir = normalize(vWorld);
    float h = dir.y * 0.5 + 0.5;
    vec3 col = mix(uHorizon, uZenith, smoothstep(0.28, 0.92, h));
    float sun = pow(max(dot(dir, normalize(uSunDir)), 0.0), 80.0);
    float glow = pow(max(dot(dir, normalize(uSunDir)), 0.0), 8.0);
    col += uSunColor * sun * 1.6;
    col += uSunColor * glow * 0.22;
    gl_FragColor = vec4(col, 1.0);
  }
`

const GRID_VERT = /* glsl */ `
  varying vec2 vUv;
  varying vec3 vPos;
  void main() {
    vUv = uv;
    vec4 world = modelMatrix * vec4(position, 1.0);
    vPos = world.xyz;
    gl_Position = projectionMatrix * viewMatrix * world;
  }
`

const GRID_FRAG = /* glsl */ `
  varying vec2 vUv;
  varying vec3 vPos;
  uniform vec3 uColor;
  void main() {
    vec2 grid = abs(fract(vPos.xz / 8.0) - 0.5);
    float line = 1.0 - min(grid.x, grid.y) * 2.0;
    float mask = smoothstep(0.04, 0.0, 1.0 - line);
    float fade = 1.0 - smoothstep(40.0, 220.0, length(vPos.xz));
    vec3 col = uColor * mask;
    gl_FragColor = vec4(col, mask * fade * 0.55);
  }
`

function Sky() {
  const mat = useRef<THREE.ShaderMaterial>(null)
  const zenith = useMemo(() => new THREE.Color('#070014'), [])
  const horizon = useMemo(() => new THREE.Color('#2a0840'), [])
  const sunColor = useMemo(() => new THREE.Color('#ff6b35'), [])
  const sunDir = useMemo(() => new THREE.Vector3(0.0, 0.18, 1.0).normalize(), [])

  useFrame((_, dt) => {
    const material = mat.current
    if (!material) return
    const { progress } = useJourney.getState()
    const { from, to, mix } = getSectionBlend(progress)
    zenith.set(from.theme.fog).lerp(new THREE.Color(to.theme.fog), mix)
    zenith.multiplyScalar(0.45)
    horizon.set(from.theme.neon).lerp(new THREE.Color(to.theme.neon), mix)
    horizon.multiplyScalar(0.22)
    sunColor.set(from.theme.sun).lerp(new THREE.Color(to.theme.sun), mix)
    material.uniforms.uZenith.value.lerp(zenith, 1 - Math.exp(-dt * 2))
    material.uniforms.uHorizon.value.lerp(horizon, 1 - Math.exp(-dt * 2))
    material.uniforms.uSunColor.value.lerp(sunColor, 1 - Math.exp(-dt * 2))
  })

  return (
    <mesh>
      <sphereGeometry args={[380, 32, 16]} />
      <shaderMaterial
        ref={mat}
        vertexShader={SKY_VERT}
        fragmentShader={SKY_FRAG}
        uniforms={{
          uZenith: { value: new THREE.Color('#070014') },
          uHorizon: { value: new THREE.Color('#2a0840') },
          uSunColor: { value: new THREE.Color('#ff6b35') },
          uSunDir: { value: sunDir },
        }}
        side={THREE.BackSide}
        depthWrite={false}
        toneMapped={false}
      />
    </mesh>
  )
}

function SynthSun() {
  const end = journeyCurve.getPointAt(1)
  return (
    <group position={[end.x, end.y + 22, end.z + 48]}>
      <mesh>
        <circleGeometry args={[16, 48]} />
        <meshBasicMaterial color="#ff5a1f" toneMapped={false} />
      </mesh>
      {Array.from({ length: 7 }, (_, i) => (
        <mesh key={i} position={[0, -2.2 - i * 2.05, 0.08]}>
          <planeGeometry args={[32, 0.9]} />
          <meshBasicMaterial color="#05010d" />
        </mesh>
      ))}
      <pointLight intensity={40} distance={180} color="#ff6b35" />
    </group>
  )
}

function GridFloor() {
  const color = useRef(new THREE.Color('#ff2bd6'))
  const mat = useRef<THREE.ShaderMaterial>(null)

  useFrame((_, dt) => {
    const material = mat.current
    if (!material) return
    const { progress } = useJourney.getState()
    const { from, to, mix } = getSectionBlend(progress)
    color.current.set(from.theme.neon).lerp(new THREE.Color(to.theme.neon), mix)
    material.uniforms.uColor.value.lerp(color.current, 1 - Math.exp(-dt * 2))
  })

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.02, 320]}>
      <planeGeometry args={[520, 760, 1, 1]} />
      <shaderMaterial
        ref={mat}
        vertexShader={GRID_VERT}
        fragmentShader={GRID_FRAG}
        uniforms={{ uColor: { value: new THREE.Color('#ff2bd6') } }}
        transparent
        depthWrite={false}
        toneMapped={false}
      />
    </mesh>
  )
}

function Stars() {
  const positions = useMemo(() => {
    const count = 1400
    const arr = new Float32Array(count * 3)
    for (let i = 0; i < count; i += 1) {
      const r = 90 + Math.random() * 260
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(Math.random() * 0.72 + 0.08)
      arr[i * 3] = r * Math.sin(phi) * Math.cos(theta)
      arr[i * 3 + 1] = Math.abs(r * Math.cos(phi)) + 8
      arr[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta) + 280
    }
    return arr
  }, [])

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial color="#f4e9ff" size={0.85} sizeAttenuation transparent opacity={0.85} />
    </points>
  )
}

function MountainRange({
  center,
  width,
  depth,
  height,
  color,
}: {
  center: [number, number, number]
  width: number
  depth: number
  height: number
  color: string
}) {
  const geometry = useMemo(() => {
    const geo = new THREE.PlaneGeometry(width, depth, 36, 10)
    const pos = geo.attributes.position
    for (let i = 0; i < pos.count; i += 1) {
      const x = pos.getX(i)
      const y = pos.getY(i)
      const ridge =
        Math.abs(Math.sin(x * 0.04) * 0.7 + Math.sin(x * 0.11 + 2.1) * 0.45 + Math.sin(x * 0.23) * 0.2)
      const taper = THREE.MathUtils.smoothstep(y, -depth * 0.5, depth * 0.15)
      pos.setZ(i, ridge * height * taper)
    }
    geo.computeVertexNormals()
    return geo
  }, [depth, height, width])

  return (
    <mesh geometry={geometry} position={center} rotation={[-Math.PI / 2, 0, 0]}>
      <meshStandardMaterial color={color} roughness={1} metalness={0} />
    </mesh>
  )
}

function Palm({ scale = 1 }: { scale?: number }) {
  return (
    <group scale={scale}>
      <mesh position={[0, 1.8, 0]}>
        <cylinderGeometry args={[0.1, 0.18, 3.6, 6]} />
        <meshStandardMaterial color="#14081c" />
      </mesh>
      {Array.from({ length: 5 }, (_, i) => (
        <mesh
          key={i}
          position={[0, 3.55, 0]}
          rotation={[1.05, (i / 5) * Math.PI * 2, 0]}
        >
          <boxGeometry args={[0.18, 1.6, 0.04]} />
          <meshStandardMaterial color="#0c0614" />
        </mesh>
      ))}
      <mesh position={[0, 3.55, 0]}>
        <sphereGeometry args={[0.16, 6, 6]} />
        <meshBasicMaterial color="#ff2bd6" toneMapped={false} />
      </mesh>
    </group>
  )
}

function RoadsideProps() {
  const quality = useJourney((s) => s.quality)
  const palmCount = quality === 'high' ? 64 : 36
  const lampCount = quality === 'high' ? 48 : 28

  const palms = useMemo(() => {
    const items: { position: THREE.Vector3; rotation: number; scale: number }[] = []
    const p = new THREE.Vector3()
    const tangent = new THREE.Vector3()
    const side = new THREE.Vector3()
    const up = new THREE.Vector3(0, 1, 0)
    for (let i = 0; i < palmCount; i += 1) {
      const t = 0.04 + (i / (palmCount - 1)) * 0.9
      journeyCurve.getPointAt(t, p)
      journeyCurve.getTangentAt(t, tangent)
      side.crossVectors(up, tangent).normalize()
      const sign = i % 2 === 0 ? 1 : -1
      const dist = 11 + (i % 5) * 1.4
      items.push({
        position: p.clone().addScaledVector(side, sign * dist),
        rotation: Math.sin(i * 1.7) * 0.15,
        scale: 0.85 + (i % 4) * 0.12,
      })
    }
    return items
  }, [palmCount])

  const lamps = useMemo(() => {
    const items: { position: THREE.Vector3; color: string }[] = []
    const p = new THREE.Vector3()
    const tangent = new THREE.Vector3()
    const side = new THREE.Vector3()
    const up = new THREE.Vector3(0, 1, 0)
    for (let i = 0; i < lampCount; i += 1) {
      const t = 0.03 + (i / (lampCount - 1)) * 0.94
      journeyCurve.getPointAt(t, p)
      journeyCurve.getTangentAt(t, tangent)
      side.crossVectors(up, tangent).normalize()
      const sign = i % 2 === 0 ? -1 : 1
      items.push({
        position: p.clone().addScaledVector(side, sign * 6.4),
        color: i % 2 === 0 ? '#ff2bd6' : '#00f0ff',
      })
    }
    return items
  }, [lampCount])

  return (
    <group>
      {palms.map((palm, i) => (
        <group key={`p-${i}`} position={palm.position} rotation={[0, palm.rotation, 0]}>
          <Palm scale={palm.scale} />
        </group>
      ))}
      {lamps.map((lamp, i) => (
        <group key={`l-${i}`} position={lamp.position}>
          <mesh position={[0, 2.2, 0]}>
            <cylinderGeometry args={[0.06, 0.09, 4.4, 5]} />
            <meshStandardMaterial color="#120816" metalness={0.6} roughness={0.4} />
          </mesh>
          <mesh position={[0, 4.5, 0]}>
            <sphereGeometry args={[0.18, 8, 8]} />
            <meshBasicMaterial color={lamp.color} toneMapped={false} />
          </mesh>
        </group>
      ))}
    </group>
  )
}

function SpeedParticles() {
  const ref = useRef<THREE.Points>(null)
  const positions = useMemo(() => {
    const count = 90
    const arr = new Float32Array(count * 3)
    for (let i = 0; i < count; i += 1) {
      arr[i * 3] = (Math.random() - 0.5) * 18
      arr[i * 3 + 1] = Math.random() * 6
      arr[i * 3 + 2] = (Math.random() - 0.5) * 24
    }
    return arr
  }, [])

  useFrame((_, dt) => {
    const points = ref.current
    if (!points) return
    const { progress, speed } = useJourney.getState()
    const p = journeyCurve.getPointAt(Math.min(0.999, progress))
    const tangent = journeyCurve.getTangentAt(Math.min(0.999, progress))
    points.position.copy(p)
    points.lookAt(p.clone().add(tangent))
    const arr = points.geometry.attributes.position.array as Float32Array
    const mag = Math.abs(speed) * 90
    for (let i = 0; i < arr.length; i += 3) {
      arr[i + 2] += mag * 0.35 + 0.02
      if (arr[i + 2] > 14) {
        arr[i] = (Math.random() - 0.5) * 16
        arr[i + 1] = Math.random() * 5 + 0.4
        arr[i + 2] = -12 - Math.random() * 6
      }
    }
    points.geometry.attributes.position.needsUpdate = true
    const mat = points.material as THREE.PointsMaterial
    mat.opacity = THREE.MathUtils.damp(mat.opacity, Math.min(0.9, mag * 0.08), 6, dt)
  })

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        color="#d9fbff"
        size={0.12}
        transparent
        opacity={0}
        depthWrite={false}
        sizeAttenuation
      />
    </points>
  )
}

export function World() {
  const quality = useJourney((s) => s.quality)

  return (
    <group>
      <Sky />
      <SynthSun />
      <Stars />
      <GridFloor />
      <MountainRange center={[-90, 0, 260]} width={260} depth={90} height={38} color="#0b0614" />
      <MountainRange center={[110, 0, 340]} width={280} depth={100} height={44} color="#0a0418" />
      <MountainRange center={[0, 0, 620]} width={360} depth={120} height={52} color="#090312" />
      <RoadsideProps />
      {quality === 'high' ? <SpeedParticles /> : null}
      <ambientLight intensity={0.22} color="#9b6bff" />
      <hemisphereLight args={['#ff8ad8', '#05010d', 0.4]} />
    </group>
  )
}
