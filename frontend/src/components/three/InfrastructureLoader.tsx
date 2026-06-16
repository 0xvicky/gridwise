import React, { useMemo, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

function RotatingNode() {
  const groupRef = useRef<THREE.Group>(null)

  const { lineObjects, nodes } = useMemo(() => {
    const material = new THREE.LineBasicMaterial({
      color: '#155959',
      transparent: true,
      opacity: 0.6,
    })
    const hub = new THREE.Vector3(0, 0, 0)
    const nodePositions = [
      new THREE.Vector3(0.8, 0.3, 0),
      new THREE.Vector3(-0.6, 0.5, 0.4),
      new THREE.Vector3(0.2, -0.7, 0.5),
      new THREE.Vector3(-0.3, -0.2, -0.7),
      new THREE.Vector3(0.5, 0.6, -0.4),
    ]
    const lines = nodePositions.map((node) => {
      const geometry = new THREE.BufferGeometry().setFromPoints([hub, node])
      return new THREE.Line(geometry, material)
    })
    return { lineObjects: lines, nodes: nodePositions }
  }, [])

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.8
    }
  })

  return (
    <group ref={groupRef}>
      {lineObjects.map((line, i) => (
        <primitive key={i} object={line} />
      ))}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[0.08, 8, 8]} />
        <meshBasicMaterial color="#F38D26" transparent opacity={0.85} />
      </mesh>
      {nodes.map((node, i) => (
        <mesh key={`n-${i}`} position={node}>
          <sphereGeometry args={[0.05, 6, 6]} />
          <meshBasicMaterial color="#155959" transparent opacity={0.55} />
        </mesh>
      ))}
    </group>
  )
}

export const InfrastructureLoader: React.FC = () => (
  <div className="flex flex-col items-center justify-center py-16">
    <div className="h-24 w-24">
      <Canvas
        camera={{ position: [0, 0, 2.5], fov: 50 }}
        gl={{ alpha: true, antialias: true }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.5} />
        <RotatingNode />
      </Canvas>
    </div>
    <p className="mt-4 text-sm text-text-secondary">Loading...</p>
  </div>
)
