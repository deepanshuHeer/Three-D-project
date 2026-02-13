import { useHelper } from '@react-three/drei'
import { DirectionalLightHelper } from 'three'
import { useRef } from 'react'

function FillLight() {
  const lightRef = useRef()

  useHelper(lightRef, DirectionalLightHelper, 1, 'black')

  return (
    <directionalLight
      ref={lightRef}
      position={[-5, 4, 3]}
      intensity={0.6}
    />
  )
}

export default FillLight;