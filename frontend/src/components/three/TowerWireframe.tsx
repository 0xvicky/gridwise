import React, { useMemo, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

type Point3 = [number, number, number]

const TOWER_LINES: Point3[][] = [
  [[-0.6, 0, -0.6], [0, 2.5, 0]],
  [[0.6, 0, -0.6], [0, 2.5, 0]],
  [[-0.6, 0, 0.6], [0, 2.5, 0]],
  [[0.6, 0, 0.6], [0, 2.5, 0]],
  [[-0.6, 0, -0.6], [0.6, 0, 0.6]],
  [[0.6, 0, -0.6], [-0.6, 0, 0.6]],
  [[-0.4, 1.2, -0.4], [0.4, 1.2, 0.4]],
  [[0.4, 1.2, -0.4], [-0.4, 1.2, 0.4]],
  [[-0.8, 2.5, 0], [0.8, 2.5, 0]],
  [[0, 2.5, -0.8], [0, 2.5, 0.8]],
  [[0, 2.5, 0], [0, 3.5, 0]],
  [[0, 3.2, 0], [-1.2, 3.2, 0]],
  [[0, 3.2, 0], [1.2, 3.2, 0]],
  [[0, 3.0, 0], [0, 3.0, -0.8]],
  [[0, 3.0, 0], [0, 3.0, 0.8]],
]

function TransmissionTower() {
  const groupRef = useRef<THREE.Group>(null)

  const lineObjects = useMemo(() => {
    const material = new THREE.LineBasicMaterial({
      color: '#155959',
      transparent: true,
      opacity: 0.36,
    })
    return TOWER_LINES.map((points) => {
      const geometry = new THREE.BufferGeometry().setFromPoints(
        points.map((p) => new THREE.Vector3(...p))
      )
      return new THREE.Line(geometry, material)
    })
  }, [])

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.15
    }
  })

  return (
    <group ref={groupRef} position={[0, -1.2, 0]}>
      {lineObjects.map((line, i) => (
        <primitive key={i} object={line} />
      ))}
    </group>
  )
}

interface TowerWireframeProps {
  className?: string
  height?: number
}

export const TowerWireframe: React.FC<TowerWireframeProps> = ({
  className,
  height = 200,
}) => (
  <div className={className} style={{ height, width: '100%' }}>
    <Canvas
      camera={{ position: [2.5, 1.5, 2.5], fov: 40 }}
      gl={{ alpha: true, antialias: true }}
      style={{ background: 'transparent' }}
    >
      <ambientLight intensity={0.6} />
      <TransmissionTower />
    </Canvas>
  </div>
)
