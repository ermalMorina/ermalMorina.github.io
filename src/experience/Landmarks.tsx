import { Text } from '@react-three/drei'
import { useMemo } from 'react'
import * as THREE from 'three'
import {
  EDUCATION,
  EXPERIENCE,
  LANGUAGES,
  PROFILE,
  SECTIONS,
  SKILLS,
} from '../content/cv'
import { journeyCurve } from '../lib/path'

const FONT = `${import.meta.env.BASE_URL}fonts/Orbitron-Bold.woff`

const _p = new THREE.Vector3()
const _t = new THREE.Vector3()
const _s = new THREE.Vector3()
const _up = new THREE.Vector3(0, 1, 0)

function poseAt(t: number, lateral = 0, y = 0, face: 'oncoming' | 'inward' = 'oncoming') {
  const u = THREE.MathUtils.clamp(t, 0, 0.999)
  journeyCurve.getPointAt(u, _p)
  journeyCurve.getTangentAt(u, _t)
  _s.crossVectors(_up, _t).normalize()
  _p.addScaledVector(_s, lateral)
  _p.y += y
  let yaw = Math.atan2(_t.x, _t.z)
  if (face === 'oncoming') {
    yaw += Math.PI
  } else {
    const dir = lateral >= 0 ? -1 : 1
    yaw = Math.atan2(_s.x * dir, _s.z * dir)
  }
  return {
    position: _p.clone(),
    rotation: [0, yaw, 0] as [number, number, number],
  }
}

function NeonText({
  children,
  color,
  fontSize = 0.7,
  position = [0, 0, 0],
  rotation,
  maxWidth,
  textAlign = 'center',
}: {
  children: string
  color: string
  fontSize?: number
  position?: [number, number, number]
  rotation?: [number, number, number]
  maxWidth?: number
  textAlign?: 'left' | 'center' | 'right'
}) {
  return (
    <Text
      font={FONT}
      fontSize={fontSize}
      letterSpacing={0.04}
      color={color}
      anchorX={textAlign}
      anchorY="middle"
      outlineWidth={0.018}
      outlineColor="#090014"
      position={position}
      rotation={rotation}
      maxWidth={maxWidth}
      textAlign={textAlign}
      material-toneMapped={false}
    >
      {children}
    </Text>
  )
}

function RoadRing({ t, color, radius = 5.6 }: { t: number; color: string; radius?: number }) {
  const pose = useMemo(() => poseAt(t, 0, 0.12), [t])
  return (
    <mesh position={[pose.position.x, pose.position.y, pose.position.z]} rotation={[-Math.PI / 2, 0, 0]}>
      <torusGeometry args={[radius, 0.06, 8, 48]} />
      <meshBasicMaterial color={color} toneMapped={false} />
    </mesh>
  )
}

function Billboard({
  t,
  lateral,
  color,
  title,
  subtitle,
  height = 6.2,
}: {
  t: number
  lateral: number
  color: string
  title: string
  subtitle?: string
  height?: number
}) {
  const pose = useMemo(() => poseAt(t, lateral, 0, 'inward'), [lateral, t])
  return (
    <group position={pose.position} rotation={pose.rotation}>
      <mesh position={[0, height * 0.45, 0]}>
        <boxGeometry args={[0.18, height, 0.18]} />
        <meshStandardMaterial color="#120816" metalness={0.5} roughness={0.4} />
      </mesh>
      <mesh position={[0, height + 0.2, 0]}>
        <boxGeometry args={[6.4, 2.4, 0.12]} />
        <meshStandardMaterial color="#09040f" metalness={0.2} roughness={0.5} />
      </mesh>
      <mesh position={[0, height + 0.2, 0.08]}>
        <boxGeometry args={[6.55, 2.55, 0.04]} />
        <meshBasicMaterial color={color} toneMapped={false} />
      </mesh>
      <mesh position={[0, height + 0.2, 0.1]}>
        <boxGeometry args={[6.2, 2.2, 0.04]} />
        <meshStandardMaterial color="#07010c" />
      </mesh>
      <NeonText color={color} fontSize={0.42} position={[0, height + 0.42, 0.16]}>
        {title}
      </NeonText>
      {subtitle ? (
        <NeonText color="#f4e9ff" fontSize={0.22} position={[0, height - 0.12, 0.16]} maxWidth={5.8}>
          {subtitle}
        </NeonText>
      ) : null}
      <pointLight position={[0, height, 1.4]} intensity={8} distance={16} color={color} />
    </group>
  )
}

function HeroGate() {
  const pose = useMemo(() => poseAt(SECTIONS[0].t, 0, 0), [])
  return (
    <group position={pose.position} rotation={pose.rotation}>
      <mesh position={[-5.6, 5.4, 0]}>
        <boxGeometry args={[0.7, 10.8, 0.7]} />
        <meshStandardMaterial color="#140818" metalness={0.55} roughness={0.32} />
      </mesh>
      <mesh position={[5.6, 5.4, 0]}>
        <boxGeometry args={[0.7, 10.8, 0.7]} />
        <meshStandardMaterial color="#140818" metalness={0.55} roughness={0.32} />
      </mesh>
      <mesh position={[0, 10.8, 0]}>
        <boxGeometry args={[12.2, 1.1, 0.7]} />
        <meshStandardMaterial color="#140818" metalness={0.55} roughness={0.32} />
      </mesh>
      <mesh position={[-5.6, 10.2, 0.4]}>
        <boxGeometry args={[0.2, 9.6, 0.08]} />
        <meshBasicMaterial color="#ff2bd6" toneMapped={false} />
      </mesh>
      <mesh position={[5.6, 10.2, 0.4]}>
        <boxGeometry args={[0.2, 9.6, 0.08]} />
        <meshBasicMaterial color="#00f0ff" toneMapped={false} />
      </mesh>
      <NeonText color="#ff4de8" fontSize={1.05} position={[0, 8.6, 0.5]}>
        {PROFILE.name.toUpperCase()}
      </NeonText>
      <NeonText color="#00f0ff" fontSize={0.38} position={[0, 7.5, 0.5]}>
        {PROFILE.title.toUpperCase()}
      </NeonText>
      <NeonText color="#f4e9ff" fontSize={0.22} position={[0, 6.85, 0.5]}>
        {PROFILE.location.toUpperCase()}
      </NeonText>
      <pointLight position={[0, 8, 3]} intensity={22} distance={28} color="#ff2bd6" />
    </group>
  )
}

function SummaryPavilion() {
  const pose = useMemo(() => poseAt(SECTIONS[1].t, -8.5, 0, 'inward'), [])
  return (
    <group position={pose.position} rotation={pose.rotation}>
      <mesh position={[0, 0.15, 0]}>
        <boxGeometry args={[8.4, 0.3, 5.2]} />
        <meshStandardMaterial color="#12081c" metalness={0.3} roughness={0.6} />
      </mesh>
      {[-1, 1].map((x) =>
        [-1, 1].map((z) => (
          <mesh key={`${x}${z}`} position={[x * 3.4, 2.1, z * 1.8]}>
            <boxGeometry args={[0.16, 4.2, 0.16]} />
            <meshStandardMaterial color="#1b0a24" />
          </mesh>
        )),
      )}
      <mesh position={[0, 4.3, 0]}>
        <boxGeometry args={[8.2, 0.12, 5]} />
        <meshBasicMaterial color="#c44dff" toneMapped={false} />
      </mesh>
      <NeonText color="#e9b8ff" fontSize={0.36} position={[0, 3.4, 2.5]}>
        PROFESSIONAL SUMMARY
      </NeonText>
      <mesh position={[0, 1.8, 0.4]}>
        <boxGeometry args={[6.6, 2.4, 0.08]} />
        <meshStandardMaterial color="#0b0312" emissive="#2a0840" emissiveIntensity={0.4} />
      </mesh>
    </group>
  )
}

function SkillsCanyon() {
  const tiles = useMemo(() => {
    return SKILLS.map((skill, i) => {
      const t = 0.2 + (i / Math.max(SKILLS.length - 1, 1)) * 0.08
      const lateral = (i % 2 === 0 ? -1 : 1) * (7.4 + (i % 3) * 0.35)
      const pose = poseAt(t, lateral, 1.4 + (i % 4) * 0.35, 'inward')
      return { skill, pose }
    })
  }, [])

  return (
    <group>
      {tiles.map(({ skill, pose }) => (
        <group key={skill.label} position={pose.position} rotation={pose.rotation}>
          <mesh>
            <boxGeometry args={[3.3, 1.35, 0.12]} />
            <meshStandardMaterial color="#08040f" metalness={0.4} roughness={0.35} />
          </mesh>
          <mesh position={[0, 0, 0.02]}>
            <boxGeometry args={[3.42, 1.46, 0.03]} />
            <meshBasicMaterial color={skill.color} toneMapped={false} />
          </mesh>
          <mesh position={[0, 0, 0.04]}>
            <boxGeometry args={[3.18, 1.22, 0.03]} />
            <meshStandardMaterial color="#08040f" />
          </mesh>
          <NeonText color={skill.color} fontSize={0.28} position={[0, 0, 0.1]}>
            {skill.label.toUpperCase()}
          </NeonText>
        </group>
      ))}
    </group>
  )
}

function Station({
  t,
  color,
  title,
  subtitle,
  lateral = 8.2,
  glyph,
}: {
  t: number
  color: string
  title: string
  subtitle: string
  lateral?: number
  glyph?: 'plus' | 'grid' | 'lab' | 'columns'
}) {
  const pose = useMemo(() => poseAt(t, lateral, 0, 'inward'), [lateral, t])
  return (
    <group position={pose.position} rotation={pose.rotation}>
      <mesh position={[0, 0.2, 0]}>
        <boxGeometry args={[9.5, 0.4, 6]} />
        <meshStandardMaterial color="#100814" metalness={0.35} roughness={0.55} />
      </mesh>
      <mesh position={[-3.8, 2.6, -2.2]}>
        <boxGeometry args={[0.28, 5.2, 0.28]} />
        <meshStandardMaterial color="#1a0c22" />
      </mesh>
      <mesh position={[3.8, 2.6, -2.2]}>
        <boxGeometry args={[0.28, 5.2, 0.28]} />
        <meshStandardMaterial color="#1a0c22" />
      </mesh>
      <mesh position={[0, 5.3, -2.2]}>
        <boxGeometry args={[8.2, 0.22, 0.7]} />
        <meshBasicMaterial color={color} toneMapped={false} />
      </mesh>
      <NeonText color={color} fontSize={0.4} position={[0, 4.55, -1.7]} maxWidth={7.6}>
        {title.toUpperCase()}
      </NeonText>
      <NeonText color="#f4e9ff" fontSize={0.2} position={[0, 3.95, -1.7]} maxWidth={7.4}>
        {subtitle.toUpperCase()}
      </NeonText>
      {glyph === 'plus' ? (
        <group position={[0, 1.8, 0.6]}>
          <mesh>
            <boxGeometry args={[1.6, 0.28, 0.28]} />
            <meshBasicMaterial color={color} toneMapped={false} />
          </mesh>
          <mesh>
            <boxGeometry args={[0.28, 1.6, 0.28]} />
            <meshBasicMaterial color={color} toneMapped={false} />
          </mesh>
        </group>
      ) : null}
      {glyph === 'grid' ? (
        <group position={[0, 1.7, 0.4]}>
          {[-1, 0, 1].map((x) =>
            [-1, 0, 1].map((y) => (
              <mesh key={`${x}${y}`} position={[x * 0.7, y * 0.55, 0]}>
                <boxGeometry args={[0.5, 0.38, 0.08]} />
                <meshBasicMaterial color={color} toneMapped={false} />
              </mesh>
            )),
          )}
        </group>
      ) : null}
      {glyph === 'lab' ? (
        <mesh position={[0, 1.7, 0.4]}>
          <octahedronGeometry args={[0.9, 0]} />
          <meshBasicMaterial color={color} toneMapped={false} />
        </mesh>
      ) : null}
      {glyph === 'columns' ? (
        <group position={[0, 1.6, 0.2]}>
          {[-1.4, 0, 1.4].map((x) => (
            <mesh key={x} position={[x, 0, 0]}>
              <cylinderGeometry args={[0.16, 0.16, 2.4, 8]} />
              <meshStandardMaterial color="#d9c8ff" metalness={0.2} roughness={0.4} />
            </mesh>
          ))}
        </group>
      ) : null}
      <pointLight position={[0, 3.2, 2]} intensity={12} distance={18} color={color} />
    </group>
  )
}

function LanguagesMarkers() {
  const left = useMemo(() => poseAt(SECTIONS[8].t, -7.6, 1.4, 'inward'), [])
  const right = useMemo(() => poseAt(SECTIONS[8].t, 7.6, 1.4, 'inward'), [])
  return (
    <group>
      <group position={left.position} rotation={left.rotation}>
        <mesh>
          <boxGeometry args={[4.4, 2.2, 0.12]} />
          <meshStandardMaterial color="#081018" />
        </mesh>
        <NeonText color="#9be7ff" fontSize={0.32} position={[0, 0.28, 0.1]}>
          {LANGUAGES[0].name.toUpperCase()}
        </NeonText>
        <NeonText color="#f4e9ff" fontSize={0.18} position={[0, -0.32, 0.1]}>
          {LANGUAGES[0].level.toUpperCase()}
        </NeonText>
      </group>
      <group position={right.position} rotation={right.rotation}>
        <mesh>
          <boxGeometry args={[5.2, 2.2, 0.12]} />
          <meshStandardMaterial color="#081018" />
        </mesh>
        <NeonText color="#9be7ff" fontSize={0.32} position={[0, 0.28, 0.1]}>
          {LANGUAGES[1].name.toUpperCase()}
        </NeonText>
        <NeonText color="#f4e9ff" fontSize={0.16} position={[0, -0.32, 0.1]} maxWidth={4.8}>
          {LANGUAGES[1].level.toUpperCase()}
        </NeonText>
      </group>
    </group>
  )
}

function ContactPlaza() {
  const pose = useMemo(() => poseAt(SECTIONS[9].t, 0, 0), [])
  return (
    <group position={pose.position} rotation={pose.rotation}>
      <mesh position={[0, 0.15, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[9.5, 40]} />
        <meshStandardMaterial color="#160814" metalness={0.4} roughness={0.5} />
      </mesh>
      <mesh position={[0, 0.18, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[8.6, 9.1, 40]} />
        <meshBasicMaterial color="#ff2bd6" side={THREE.DoubleSide} toneMapped={false} />
      </mesh>
      <mesh position={[0, 3.2, 0]}>
        <cylinderGeometry args={[0.18, 0.22, 6.2, 8]} />
        <meshStandardMaterial color="#1a0c22" />
      </mesh>
      <mesh position={[0, 6.4, 0]}>
        <boxGeometry args={[10.4, 2.1, 0.16]} />
        <meshStandardMaterial color="#090410" />
      </mesh>
      <NeonText color="#ff4de8" fontSize={0.42} position={[0, 6.75, 0.14]}>
        {PROFILE.email.toUpperCase()}
      </NeonText>
      <NeonText color="#00f0ff" fontSize={0.24} position={[0, 6.1, 0.14]}>
        {PROFILE.location.toUpperCase()}
      </NeonText>
      <pointLight position={[0, 5, 2]} intensity={24} distance={26} color="#ff2bd6" />
    </group>
  )
}

export function Landmarks() {
  return (
    <group>
      <RoadRing t={SECTIONS[0].t} color="#ff2bd6" radius={6.2} />
      <RoadRing t={SECTIONS[1].t} color="#c44dff" />
      <RoadRing t={SECTIONS[2].t} color="#00f0ff" />
      <RoadRing t={SECTIONS[3].t} color="#1e90ff" />
      <RoadRing t={SECTIONS[4].t} color="#2ee6a6" />
      <RoadRing t={SECTIONS[5].t} color="#ff5bb0" />
      <RoadRing t={SECTIONS[6].t} color="#ffb347" />
      <RoadRing t={SECTIONS[7].t} color="#b388ff" />
      <RoadRing t={SECTIONS[8].t} color="#9be7ff" />
      <RoadRing t={SECTIONS[9].t} color="#ff2bd6" radius={8.8} />
      <HeroGate />
      <SummaryPavilion />
      <SkillsCanyon />
      <Station
        t={SECTIONS[3].t}
        color="#1e90ff"
        title={EXPERIENCE[0].company}
        subtitle={EXPERIENCE[0].role}
        glyph="grid"
        lateral={8.6}
      />
      <Billboard
        t={SECTIONS[3].t}
        lateral={-8.8}
        color="#1e90ff"
        title={EXPERIENCE[0].dates}
        subtitle="React · Node.js · GraphQL · AG Grid"
      />
      <Station
        t={SECTIONS[4].t}
        color="#2ee6a6"
        title={EXPERIENCE[1].company}
        subtitle={EXPERIENCE[1].role}
        glyph="plus"
        lateral={-8.4}
      />
      <Billboard
        t={SECTIONS[4].t}
        lateral={8.6}
        color="#2ee6a6"
        title={EXPERIENCE[1].dates}
        subtitle="React Native · Expo · Node.js · GraphQL"
      />
      <Station
        t={SECTIONS[5].t}
        color="#ff5bb0"
        title={EXPERIENCE[2].company}
        subtitle={EXPERIENCE[2].role}
        glyph="grid"
        lateral={8.5}
      />
      <Billboard
        t={SECTIONS[5].t}
        lateral={-8.8}
        color="#ff5bb0"
        title={EXPERIENCE[2].dates}
        subtitle="High-traffic CRM · REST APIs"
      />
      <Station
        t={SECTIONS[6].t}
        color="#ffb347"
        title={EXPERIENCE[3].company}
        subtitle={EXPERIENCE[3].role}
        glyph="lab"
        lateral={-8.2}
      />
      <Billboard
        t={SECTIONS[6].t}
        lateral={8.4}
        color="#ffb347"
        title={EXPERIENCE[3].dates}
        subtitle="Web features · REST APIs"
      />
      <Station
        t={SECTIONS[7].t}
        color="#b388ff"
        title="UBT"
        subtitle={EDUCATION.degree}
        glyph="columns"
        lateral={8.2}
      />
      <Billboard
        t={SECTIONS[7].t}
        lateral={-8.6}
        color="#b388ff"
        title="ICK REACT JS"
        subtitle={EDUCATION.certTitle}
      />
      <LanguagesMarkers />
      <ContactPlaza />
    </group>
  )
}
