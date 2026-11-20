import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

export function SkateboardScene() {
  const groupRef = useRef<THREE.Group>(null);

  // World
  const groundGeometry = new THREE.CylinderGeometry(8, 8, 0.2, 32);
  const groundMaterial = new THREE.MeshStandardMaterial({
    color: '#1a1a2e',
    metalness: 0.3,
    roughness: 0.8,
  });
  const ground = new THREE.Mesh(groundGeometry, groundMaterial);
  ground.rotation.x = -Math.PI / 2;
  ground.receiveShadow = true;

  // Skateboard deck
  const deckGeometry = new THREE.BoxGeometry(2.2, 0.15, 0.8);
  const deckMaterial = new THREE.MeshStandardMaterial({
    color: '#7c5cff',
    metalness: 0.4,
    roughness: 0.6,
  });
  const deck = new THREE.Mesh(deckGeometry, deckMaterial);
  deck.position.y = 0.9;
  deck.castShadow = true;

  // Skateboard truck
  const truckGeometry = new THREE.BoxGeometry(0.08, 0.02, 0.4);
  const truckMaterial = new THREE.MeshStandardMaterial({
    color: '#4a4a6a',
    metalness: 0.7,
    roughness: 0.3,
  });
  const frontTruck = new THREE.Mesh(truckGeometry, truckMaterial);
  frontTruck.position.set(0, 0.85, 0.4);
  const backTruck = new THREE.Mesh(truckGeometry, truckMaterial);
  backTruck.position.set(0, 0.85, -0.4);

  // Wheels
  const wheelGeometry = new THREE.CylinderGeometry(0.08, 0.08, 0.06, 12);
  const wheelMaterial = new THREE.MeshStandardMaterial({
    color: '#333344',
    metalness: 0.6,
    roughness: 0.4,
  });
  const wheelPositions = [
    [-0.9, 0.85, 0.4], [0.9, 0.85, 0.4],
    [-0.9, 0.85, -0.4], [0.9, 0.85, -0.4],
  ];
  const wheels = wheelPositions.map((pos, i) => {
    const wheel = new THREE.Mesh(wheelGeometry, wheelMaterial);
    wheel.position.set(pos[0], pos[1], pos[2]);
    wheel.rotation.x = Math.PI / 2;
    wheel.castShadow = true;
    return wheel;
  });

  // Rider (simple figure)
  const bodyGeometry = new THREE.SphereGeometry(0.3, 16, 16);
  const bodyMaterial = new THREE.MeshStandardMaterial({
    color: '#ffcc00',
    metalness: 0.2,
    roughness: 0.7,
  });
  const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
  body.position.y = 0.9;
  body.castShadow = true;

  const headGeometry = new THREE.SphereGeometry(0.15, 16, 16);
  const headMaterial = new THREE.MeshStandardMaterial({
    color: '#ffcc00',
    metalness: 0.2,
    roughness: 0.7,
  });
  const head = new THREE.Mesh(headGeometry, headMaterial);
  head.position.y = 1.2;

  const legGeometry = new THREE.BoxGeometry(0.06, 0.25, 0.06);
  const legMaterial = new THREE.MeshStandardMaterial({
    color: '#333344',
    metalness: 0.4,
    roughness: 0.6,
  });
  const leftLeg = new THREE.Mesh(legGeometry, legMaterial);
  leftLeg.position.set(-0.12, 0.6, 0);
  const rightLeg = new THREE.Mesh(legGeometry, legMaterial);
  rightLeg.position.set(0.12, 0.6, 0);

  // Scene group
  const sceneGroup = new THREE.Group();
  sceneGroup.add(ground);
  sceneGroup.add(deck);
  sceneGroup.add(frontTruck);
  sceneGroup.add(backTruck);
  wheels.forEach(w => sceneGroup.add(w));
  sceneGroup.add(body);
  sceneGroup.add(head);
  sceneGroup.add(leftLeg);
  sceneGroup.add(rightLeg);

  // Ground grid helper
  const gridHelper = new THREE.GridHelper(20, 40, 0x444466, 0x444466);
  gridHelper.position.y = 0.1;

  return (
    <>
      <mesh geometry={groundGeometry} material={groundMaterial} rotation={[-Math.PI / 2, 0, 0]} />
      <gridHelper />
      <group ref={groupRef}>
        <mesh geometry={deckGeometry} material={deckMaterial} position={[0, 0.9, 0]} castShadow />
        <mesh geometry={truckGeometry} material={truckMaterial} position={[0, 0.85, 0.4]} />
        <mesh geometry={truckGeometry} material={truckMaterial} position={[0, 0.85, -0.4]} />
        {wheels.map((w, i) => (
          <mesh key={i} geometry={wheelGeometry} material={wheelMaterial} position={[w.position.x, w.position.y, w.position.z]} rotation={[0, 0, Math.PI / 2]} />
        ))}
        <mesh geometry={bodyGeometry} material={bodyMaterial} position={[0, 0.9, 0]} castShadow />
        <mesh geometry={headGeometry} material={headMaterial} position={[0, 1.2, 0]} />
        <mesh geometry={legGeometry} material={legMaterial} position={[-0.12, 0.6, 0]} />
        <mesh geometry={legGeometry} material={legMaterial} position={[0.12, 0.6, 0]} />
      </group>
    </>
  );
}
