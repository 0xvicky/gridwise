import React, { useMemo, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const wrap = (value: number, min: number, max: number) => {
  const range = max - min
  return ((((value - min) % range) + range) % range) + min
}

function FloatingTiles({
  count = 60,
  color,
  opacity = 0.34,
  speedMultiplier = 1,
}: {
  count?: number
  color: string
  opacity?: number
  speedMultiplier?: number
}) {
  const ref = useRef<THREE.InstancedMesh>(null)
  const temp = useMemo(() => new THREE.Object3D(), [])

  const tiles = useMemo(() => {
    return Array.from({ length: count }, () => ({
      x: (Math.random() - 0.5) * 21,
      y: (Math.random() - 0.5) * 12,
      z: (Math.random() - 0.5) * 4,
      size: 0.08 + Math.random() * 0.15,
      speedX: (0.14 + Math.random() * 0.16) * speedMultiplier,
      speedY: (0.1 + Math.random() * 0.12) * speedMultiplier,
      phase: Math.random() * Math.PI * 2,
    }))
  }, [count, speedMultiplier])

  useFrame(({ clock }) => {
    if (!ref.current) return

    const elapsed = clock.getElapsedTime()
    tiles.forEach((tile, i) => {
      const x = wrap(tile.x + elapsed * tile.speedX, -10.5, 10.5)
      const y = wrap(tile.y + elapsed * tile.speedY, -6, 6)
      temp.position.set(x, y, tile.z)
      temp.rotation.set(0, 0, elapsed * 0.05 + tile.phase)
      temp.scale.setScalar(tile.size)
      temp.updateMatrix()
      ref.current?.setMatrixAt(i, temp.matrix)
    })
    ref.current.instanceMatrix.needsUpdate = true
  })

  return (
    <instancedMesh ref={ref} args={[undefined, undefined, count]}>
      <boxGeometry args={[1, 1, 0.08]} />
      <meshBasicMaterial
        color={color}
        transparent
        opacity={opacity}
        depthWrite={false}
      />
    </instancedMesh>
  )
}

function SoftConnections({ count = 54 }: { count?: number }) {
  const ref = useRef<THREE.Points>(null)

  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 20
      pos[i * 3 + 1] = (Math.random() - 0.5) * 12
      pos[i * 3 + 2] = (Math.random() - 0.5) * 5
    }
    return pos
  }, [count])

  useFrame((_, delta) => {
    if (ref.current) {
      ref.current.rotation.y += delta * 0.006
      const pos = ref.current.geometry.attributes.position.array as Float32Array
      for (let i = 0; i < count; i++) {
        pos[i * 3] += delta * 0.085
        pos[i * 3 + 1] += delta * 0.064
        if (pos[i * 3] > 10) pos[i * 3] = -10
        if (pos[i * 3 + 1] > 6) pos[i * 3 + 1] = -6
      }
      ref.current.geometry.attributes.position.needsUpdate = true
    }
  })

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        color="#F38D26"
        size={0.04}
        transparent
        opacity={0.22}
        sizeAttenuation
      />
    </points>
  )
}

export const ParticleBackground: React.FC = () => (
  <div className="pointer-events-none fixed inset-0 z-0 opacity-100">
    <Canvas
      camera={{ position: [0, 0, 5], fov: 60 }}
      gl={{ alpha: true, antialias: false }}
      style={{ background: 'transparent' }}
      dpr={[1, 1.5]}
    >
      <FloatingTiles color="#155959" count={64} opacity={0.38} speedMultiplier={1.05} />
      <FloatingTiles color="#F38D26" count={42} opacity={0.34} speedMultiplier={1.2} />
      <SoftConnections />
    </Canvas>
  </div>
)
