import React, { useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import {
  BoxGeometry,
  SphereGeometry,
  PointsMaterial,
  Points,
  MeshStandardMaterial,
  Mesh,
  Group,
  AmbientLight,
  DirectionalLight,
  MeshBasicMaterial,
} from 'three';

export function SpaceshipRacingScene() {
  const spaceshipRef = useRef<Group>(null);

  // Star field (background)
  const starCount = 300;
  const starGeometry = new THREE.BufferGeometry();
  const starPositions = new Float32Array(starCount * 3);
  for (let i = 0; i < starCount * 3; i++) {
    starPositions[i] = (Math.random() - 0.5) * 200;
  }
  starGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
  const starMaterial = new THREE.PointsMaterial({
    color: 0xffffff,
    size: 0.1,
    transparent: true,
    opacity: 0.8,
  });

  // Nebula (background)
  const nebulaGeometry = new SphereGeometry(15, 32, 32);
  const nebulaMaterial = new MeshBasicMaterial({
    color: 0x3366ff,
    transparent: true,
    opacity: 0.15,
    side: THREE.BackSide,
  });

  // Spaceship body
  const bodyGeometry = new BoxGeometry(0.6, 0.15, 0.3);
  const bodyMaterial = new MeshStandardMaterial({
    color: '#ff6b6b',
    metalness: 0.3,
    roughness: 0.4,
  });

  // Wings
  const wingGeometry = new BoxGeometry(0.8, 0.04, 0.08);
  const wingMaterial = new MeshStandardMaterial({
    color: '#ff8b8b',
    metalness: 0.4,
    roughness: 0.5,
  });

  // Cockpit
  const cockpitGeometry = new SphereGeometry(0.12, 12, 12);
  const cockpitMaterial = new MeshStandardMaterial({
    color: '#44ddff',
    metalness: 0.6,
    roughness: 0.2,
    emissive: '#44ddff',
    emissiveIntensity: 0.2,
  });

  // Engine glow
  const engineGeometry = new SphereGeometry(0.05, 8, 8);
  const engineMaterial = new MeshStandardMaterial({
    color: 0xff6b6b,
    emissive: 0xff6b6b,
    emissiveIntensity: 0.5,
  });

  return (
    <>
      <ambientLight intensity={0.3} />
      <directionalLight position={[10, 10, 5]} intensity={0.5} />
      <mesh geometry={nebulaGeometry} material={nebulaMaterial} />
      <points geometry={starGeometry} material={starMaterial} />
      <group ref={spaceshipRef}>
        <mesh geometry={bodyGeometry} material={bodyMaterial} position={[0, 0, 0]} castShadow />
        <mesh geometry={wingGeometry} material={wingMaterial} position={[-0.35, 0, 0]} />
        <mesh geometry={wingGeometry} material={wingMaterial} position={[0.35, 0, 0]} />
        <mesh geometry={cockpitGeometry} material={cockpitMaterial} position={[0, 0.08, 0.16]} />
        <mesh geometry={engineGeometry} material={engineMaterial} position={[0, -0.08, 0]} />
      </group>
    </>
  );
}
