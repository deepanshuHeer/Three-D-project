import { useHelper } from '@react-three/drei'
import { DirectionalLightHelper } from 'three'
import { useRef } from 'react'

function BgLight() {
  const lightRef = useRef()

  useHelper(lightRef, DirectionalLightHelper, 1, 'black')

  return (
    <directionalLight
      ref={lightRef}
  position={[0, 5, -5]}
  intensity={0.6}
    />
  )
}


export default BgLight;