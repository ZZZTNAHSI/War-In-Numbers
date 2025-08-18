import  { useRef } from 'react'
import { Canvas, useFrame, useLoader } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import * as THREE from "three";
import { EffectComposer, SelectiveBloom } from '@react-three/postprocessing'

// import image from "./assets/download (5).jpg";

import img from "./assets/Untitled design (1).png"
function SpinningGlobe() {
  const globeRef = useRef<THREE.Mesh>(null!);
  const globe = useLoader(THREE.TextureLoader , img);
  console.log(globe);
  globe.wrapS = THREE.ClampToEdgeWrapping;
  globe.wrapT = THREE.ClampToEdgeWrapping;
  globe.minFilter = THREE.LinearFilter;
  globe.magFilter = THREE.NearestFilter;
  globe.minFilter = THREE.LinearMipMapLinearFilter;
  globe.anisotropy = 16;



  useFrame(() => {
    if (globeRef.current) {
      globeRef.current.rotation.y += 0.005
    }
  })

  return (
    <mesh ref={globeRef}>
      <sphereGeometry args={[1, 128, 128]} />
        <meshStandardMaterial
          map={globe}                 // visible texture
          emissiveMap={globe}         // glow from texture brightness
          emissive="#F2613F"          // glow color (orange)
          emissiveIntensity={1.5}     // increase for stronger glow
          toneMapped={false}          // necessary for bloom
        />
    </mesh>
  )
}

export default function App() {
  return (
    <Canvas  style={{width: "100%", height: "100vh"}} camera={{ position: [4, 2, -1], fov: 60 }} >
      <ambientLight intensity={0.2} />
      <pointLight position={[5, 5, 5]} intensity={.75} />
      <SpinningGlobe />
      <EffectComposer>
        <SelectiveBloom 
          
          luminanceThreshold={0}
          luminanceSmoothing={0.9}
          intensity={1} // glow strength
        />
      </EffectComposer>
      <OrbitControls enableZoom={false} />
    </Canvas>
  )
}
