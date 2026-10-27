import * as THREE from 'three'

const CONTROL_POINTS = [
  new THREE.Vector3(0, 0.0, 0),
  new THREE.Vector3(0, 0.4, 55),
  new THREE.Vector3(-16, 1.2, 120),
  new THREE.Vector3(-8, 2.0, 185),
  new THREE.Vector3(14, 1.4, 255),
  new THREE.Vector3(20, 0.6, 325),
  new THREE.Vector3(-6, 0.2, 395),
  new THREE.Vector3(-14, 1.0, 465),
  new THREE.Vector3(6, 1.8, 540),
  new THREE.Vector3(0, 2.4, 605),
  new THREE.Vector3(0, 2.6, 670),
]

export const journeyCurve = new THREE.CatmullRomCurve3(CONTROL_POINTS, false, 'catmullrom', 0.32)
export const PATH_LENGTH = journeyCurve.getLength()

const _tangent = new THREE.Vector3()
const _look = new THREE.Vector3()
const _up = new THREE.Vector3(0, 1, 0)
const _matrix = new THREE.Matrix4()

export function samplePath(
  t: number,
  outPos: THREE.Vector3,
  outQuat: THREE.Quaternion,
  outTangent?: THREE.Vector3,
  outSide?: THREE.Vector3,
): void {
  const u = clamp01(t)
  journeyCurve.getPointAt(u, outPos)
  journeyCurve.getTangentAt(u, _tangent)
  _look.copy(outPos).add(_tangent)
  _matrix.lookAt(outPos, _look, _up)
  outQuat.setFromRotationMatrix(_matrix)
  if (outTangent) outTangent.copy(_tangent)
  if (outSide) outSide.crossVectors(_up, _tangent).normalize()
}

export function createRibbonGeometry(
  curve: THREE.CatmullRomCurve3,
  width: number,
  segments: number,
  yOffset = 0,
  vRepeat = 40,
  lateralOffset = 0,
): THREE.BufferGeometry {
  const positions: number[] = []
  const uvs: number[] = []
  const indices: number[] = []
  const left = new THREE.Vector3()
  const right = new THREE.Vector3()
  const pos = new THREE.Vector3()
  const tangent = new THREE.Vector3()
  const side = new THREE.Vector3()

  for (let i = 0; i <= segments; i += 1) {
    const t = i / segments
    curve.getPointAt(t, pos)
    curve.getTangentAt(t, tangent)
    side.crossVectors(_up, tangent).normalize()
    pos.addScaledVector(side, lateralOffset)
    left.copy(pos).addScaledVector(side, width * 0.5)
    right.copy(pos).addScaledVector(side, -width * 0.5)
    left.y += yOffset
    right.y += yOffset
    positions.push(left.x, left.y, left.z, right.x, right.y, right.z)
    uvs.push(0, t * vRepeat, 1, t * vRepeat)
    if (i < segments) {
      const a = i * 2
      indices.push(a, a + 2, a + 1, a + 1, a + 2, a + 3)
    }
  }

  const geo = new THREE.BufferGeometry()
  geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
  geo.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2))
  geo.setIndex(indices)
  geo.computeVertexNormals()
  return geo
}

export function clamp01(v: number): number {
  return v < 0 ? 0 : v > 1 ? 1 : v
}
