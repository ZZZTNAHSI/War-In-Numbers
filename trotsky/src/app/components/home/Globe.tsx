"use client";
    import  { useRef } from 'react'
    import { Canvas, useFrame, useLoader } from '@react-three/fiber'
    import { OrbitControls} from '@react-three/drei'
    import * as THREE from "three";
   
    // import image  from "../../../assets/earth.png";

const Globe: React.FC<{}> = () => {

    function SpinningGlobe() {
      const globeRef = useRef<THREE.Mesh>(null!);
      const globe = useLoader(THREE.TextureLoader , '/earth.png');
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
          <sphereGeometry args={[1, 32, 32]} />
            <meshStandardMaterial
              map={globe}                 // visible texture
              emissiveMap={globe}         // glow from texture brightness
              emissive="#F2613F"          // glow color (orange)
              emissiveIntensity={1.5}     // increase for stronger glow
              toneMapped={false}
              
            />
        </mesh>
      )
    }
    
   
      return (
        <Canvas  style={{width: "100%", height: "100%"}} camera={{ position: [0, 0, 2], fov: 60 }} >
          <SpinningGlobe />
          <OrbitControls enableZoom={false}   enablePan={false} minPolarAngle={Math.PI / 2} maxPolarAngle={Math.PI / 2}  />
        </Canvas>
      )
    }
    


export default Globe;

