import { useHelper } from '@react-three/drei'
import { DirectionalLightHelper } from 'three'
import { useRef } from 'react'

function KeyLight() {
  const lightRef = useRef()

  // useHelper(lightRef, DirectionalLightHelper, 1, 'yellow')

  return (
    <directionalLight
      ref={lightRef}
      position={[5, 8, 5]}
      intensity={1}
      castShadow 
    />
  )
}


export default KeyLight;