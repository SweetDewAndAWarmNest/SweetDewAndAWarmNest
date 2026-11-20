import React, { useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { BoxGeometry, CylinderGeometry, SphereGeometry, MeshStandardMaterial, Mesh, Group } from 'three';

export function CarRacingScene() {
  const carRef = useRef<Group>(null);

  // Track ground
  const trackGeometry = new BoxGeometry(12, 0.1, 24);
  const trackMaterial = new MeshStandardMaterial({
    color: '#2a2a42',
    metalness: 0.3,
    roughness: 0.7,
  });

  // Lane lines
  const lineGeometry = new BoxGeometry(0.05, 0.01, 22);
  const lineMaterial = new MeshStandardMaterial({
    color: '#444466',
    metalness: 0.4,
    roughness: 0.5,
  });

  // Car body
  const carBodyGeometry = new BoxGeometry(1.2, 0.4, 0.6);
  const carBodyMaterial = new MeshStandardMaterial({
    color: '#7c5cff',
    metalness: 0.3,
    roughness: 0.5,
  });

  // Car wheels
  const wheelGeometry = new CylinderGeometry(0.06, 0.06, 0.12, 12);
  const wheelMaterial = new MeshStandardMaterial({
    color: '#333344',
    metalness: 0.6,
    roughness: 0.4,
  });

  // Headlight
  const headlightGeometry = new SphereGeometry(0.04, 8, 8);
  const headlightMaterial = new MeshStandardMaterial({
    color: '#ffffff',
    emissive: '#44ddff',
    emissiveIntensity: 0.5,
  });

  return (
    <>
      <mesh geometry={trackGeometry} material={trackMaterial} />
      <mesh geometry={lineGeometry} material={lineMaterial} position={[-5, 0.05, 0]} />
      <mesh geometry={lineGeometry} material={lineMaterial} position={[5, 0.05, 0]} />
      <group ref={carRef}>
        <mesh geometry={carBodyGeometry} material={carBodyMaterial} position={[0, 0.25, 0]} castShadow />
        {([
          [-0.6, 0.25, -0.3] as const,
          [0.6, 0.25, -0.3] as const,
          [-0.6, 0.25, 0.3] as const,
          [0.6, 0.25, 0.3] as const,
        ] as const).map((pos, i) => (
          <mesh key={i} geometry={wheelGeometry} material={wheelMaterial} position={pos as [number, number, number]} rotation={[0, 0, Math.PI / 2]} castShadow />
        ))}
        <mesh geometry={headlightGeometry} material={headlightMaterial} position={[0, 0.3, 0.32]} />
      </group>
    </>
  );
}
