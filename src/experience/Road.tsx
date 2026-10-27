import { useMemo } from 'react'
import * as THREE from 'three'
import { createRibbonGeometry, journeyCurve } from '../lib/path'

const ROAD_VERT = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

const ROAD_FRAG = /* glsl */ `
  varying vec2 vUv;
  uniform vec3 uEdgeA;
  uniform vec3 uEdgeB;
  void main() {
    vec3 asphalt = vec3(0.055, 0.04, 0.09);
    float lane = min(vUv.x, 1.0 - vUv.x);
    float edge = smoothstep(0.09, 0.02, lane);
    vec3 neon = mix(uEdgeA, uEdgeB, vUv.x);
    vec3 col = mix(asphalt, neon, edge * 0.95);

    float center = smoothstep(0.018, 0.0, abs(vUv.x - 0.5) - 0.006);
    float dash = step(0.42, fract(vUv.y * 0.55));
    col = mix(col, vec3(1.0, 0.86, 0.28), center * dash);

    float shoulder = smoothstep(0.16, 0.22, lane) * smoothstep(0.30, 0.22, lane);
    col = mix(col, vec3(0.18, 0.12, 0.28), shoulder * 0.5);

    gl_FragColor = vec4(col, 1.0);
  }
`

export function Road() {
  const asphalt = useMemo(() => createRibbonGeometry(journeyCurve, 9.2, 280, 0.04, 70), [])
  const leftRail = useMemo(() => createRibbonGeometry(journeyCurve, 0.16, 180, 0.2, 40, 4.72), [])
  const rightRail = useMemo(() => createRibbonGeometry(journeyCurve, 0.16, 180, 0.2, 40, -4.72), [])

  return (
    <group>
      <mesh geometry={asphalt} frustumCulled={false}>
        <shaderMaterial
          vertexShader={ROAD_VERT}
          fragmentShader={ROAD_FRAG}
          uniforms={{
            uEdgeA: { value: new THREE.Color('#ff2bd6') },
            uEdgeB: { value: new THREE.Color('#00f0ff') },
          }}
          toneMapped={false}
        />
      </mesh>
      <mesh geometry={leftRail} frustumCulled={false}>
        <meshBasicMaterial color="#ff2bd6" toneMapped={false} />
      </mesh>
      <mesh geometry={rightRail} frustumCulled={false}>
        <meshBasicMaterial color="#00f0ff" toneMapped={false} />
      </mesh>
    </group>
  )
}
