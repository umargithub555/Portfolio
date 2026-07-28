/**
 * IMPORTANT: Loading glTF models into a Three.js scene is a lot of work.
 * Before we can configure or animate our model's meshes, we need to iterate through
 * each part of our model's meshes and save them separately.
 *
 * But luckily there is an app that turns gltf or glb files into jsx components
 * For this model, visit https://gltf.pmnd.rs/
 * And get the code. And then add the rest of the things.
 * YOU DON'T HAVE TO WRITE EVERYTHING FROM SCRATCH
 */

import { a } from "@react-spring/three";
import { useEffect, useRef } from "react";
import { useGLTF } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";

import islandScene from "../assets/3d/island.glb";

export function Island({
  isRotating,
  setIsRotating,
  setCurrentStage,
  currentFocusPoint,
  ...props
}) {
  const islandRef = useRef();
  const { gl, viewport } = useThree();
  const { nodes, materials } = useGLTF(islandScene);

  const lastX = useRef(0);
  const rotationSpeed = useRef(0);
  const activePointerId = useRef(null);
  const activePointerButton = useRef(null);
  const wheelTimeoutRef = useRef(null);
  const dampingFactor = 0.95;
  const wheelRotationFactor = 0.0009;
  const maxWheelStep = 0.03;
  const maxWheelSpeed = 0.02;

  const isSupportedMouseButton = (event) =>
    event.pointerType !== "mouse" || [0, 1, 2].includes(event.button);

  const isButtonStillPressed = (event) => {
    if (activePointerButton.current === null) return false;
    const buttonMask = 1 << activePointerButton.current;
    return (event.buttons & buttonMask) !== 0;
  };

  const handlePointerDown = (event) => {
    if (!isSupportedMouseButton(event)) return;

    event.stopPropagation();
    event.preventDefault();

    activePointerId.current = event.pointerId;
    activePointerButton.current = event.button;
    setIsRotating(true);
    lastX.current = event.clientX;

    if (gl.domElement.setPointerCapture) {
      gl.domElement.setPointerCapture(event.pointerId);
    }
  };

  const handlePointerUp = (event) => {
    if (
      activePointerId.current !== null &&
      event.pointerId !== activePointerId.current
    ) {
      return;
    }

    event.stopPropagation();
    event.preventDefault();

    setIsRotating(false);
    activePointerId.current = null;
    activePointerButton.current = null;

    if (gl.domElement.releasePointerCapture) {
      try {
        gl.domElement.releasePointerCapture(event.pointerId);
      } catch {
        // Ignore release errors when capture is already cleared.
      }
    }
  };

  const handlePointerMove = (event) => {
    if (!isRotating) return;
    if (
      activePointerId.current !== null &&
      event.pointerId !== activePointerId.current
    ) {
      return;
    }

    if (event.pointerType === "mouse" && !isButtonStillPressed(event)) {
      setIsRotating(false);
      activePointerId.current = null;
      activePointerButton.current = null;
      return;
    }

    event.stopPropagation();
    event.preventDefault();

    const delta = (event.clientX - lastX.current) / viewport.width;
    islandRef.current.rotation.y += delta * 0.01 * Math.PI;
    lastX.current = event.clientX;
    rotationSpeed.current = delta * 0.01 * Math.PI;
  };

  const handleWheel = (event) => {
    event.stopPropagation();
    event.preventDefault();

    const rawStep = event.deltaY * wheelRotationFactor;
    const clampedStep = Math.max(-maxWheelStep, Math.min(maxWheelStep, rawStep));
    islandRef.current.rotation.y += clampedStep * Math.PI;

    rotationSpeed.current += clampedStep * 0.35 * Math.PI;
    rotationSpeed.current = Math.max(
      -maxWheelSpeed,
      Math.min(maxWheelSpeed, rotationSpeed.current)
    );

    if (!isRotating) {
      setIsRotating(true);
    }

    if (wheelTimeoutRef.current) {
      clearTimeout(wheelTimeoutRef.current);
    }

    wheelTimeoutRef.current = window.setTimeout(() => {
      setIsRotating(false);
      wheelTimeoutRef.current = null;
    }, 80);
  };

  const handleContextMenu = (event) => {
    event.preventDefault();
  };

  const handleKeyDown = (event) => {
    if (event.key === "ArrowLeft") {
      if (!isRotating) setIsRotating(true);

      islandRef.current.rotation.y += 0.005 * Math.PI;
      rotationSpeed.current = 0.007;
    } else if (event.key === "ArrowRight") {
      if (!isRotating) setIsRotating(true);

      islandRef.current.rotation.y -= 0.005 * Math.PI;
      rotationSpeed.current = -0.007;
    }
  };

  const handleKeyUp = (event) => {
    if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
      setIsRotating(false);
    }
  };

  const handleTouchStart = (event) => {
    event.stopPropagation();
    event.preventDefault();
    setIsRotating(true);

    const clientX = event.touches ? event.touches[0].clientX : event.clientX;
    lastX.current = clientX;
  };

  const handleTouchEnd = (event) => {
    event.stopPropagation();
    event.preventDefault();
    setIsRotating(false);
  };

  const handleTouchMove = (event) => {
    event.stopPropagation();
    event.preventDefault();

    if (isRotating) {
      const clientX = event.touches ? event.touches[0].clientX : event.clientX;
      const delta = (clientX - lastX.current) / viewport.width;

      islandRef.current.rotation.y += delta * 0.01 * Math.PI;
      lastX.current = clientX;
      rotationSpeed.current = delta * 0.01 * Math.PI;
    }
  };

  useEffect(() => {
    const canvas = gl.domElement;
    canvas.addEventListener("pointerdown", handlePointerDown);
    window.addEventListener("pointerup", handlePointerUp);
    window.addEventListener("pointermove", handlePointerMove);
    canvas.addEventListener("wheel", handleWheel, { passive: false });
    canvas.addEventListener("contextmenu", handleContextMenu);
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    canvas.addEventListener("touchstart", handleTouchStart);
    canvas.addEventListener("touchend", handleTouchEnd);
    canvas.addEventListener("touchmove", handleTouchMove);

    return () => {
      canvas.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("pointerup", handlePointerUp);
      window.removeEventListener("pointermove", handlePointerMove);
      canvas.removeEventListener("wheel", handleWheel);
      canvas.removeEventListener("contextmenu", handleContextMenu);
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      canvas.removeEventListener("touchstart", handleTouchStart);
      canvas.removeEventListener("touchend", handleTouchEnd);
      canvas.removeEventListener("touchmove", handleTouchMove);

      if (wheelTimeoutRef.current) {
        clearTimeout(wheelTimeoutRef.current);
      }
    };
  }, [gl, isRotating, setIsRotating, viewport.width]);

  useFrame(() => {
    if (!isRotating) {
      rotationSpeed.current *= dampingFactor;

      if (Math.abs(rotationSpeed.current) < 0.001) {
        rotationSpeed.current = 0;
      }

      islandRef.current.rotation.y += rotationSpeed.current;
    } else {
      const rotation = islandRef.current.rotation.y;
      const normalizedRotation =
        ((rotation % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);

      switch (true) {
        case normalizedRotation >= 5.45 && normalizedRotation <= 5.85:
          setCurrentStage(4);
          break;
        case normalizedRotation >= 0.85 && normalizedRotation <= 1.3:
          setCurrentStage(3);
          break;
        case normalizedRotation >= 2.4 && normalizedRotation <= 2.6:
          setCurrentStage(2);
          break;
        case normalizedRotation >= 4.25 && normalizedRotation <= 4.75:
          setCurrentStage(1);
          break;
        default:
          setCurrentStage(null);
      }
    }
  });

  return (
    <a.group ref={islandRef} {...props}>
      <mesh
        geometry={nodes.polySurface944_tree_body_0.geometry}
        material={materials.PaletteMaterial001}
      />
      <mesh
        geometry={nodes.polySurface945_tree1_0.geometry}
        material={materials.PaletteMaterial001}
      />
      <mesh
        geometry={nodes.polySurface946_tree2_0.geometry}
        material={materials.PaletteMaterial001}
      />
      <mesh
        geometry={nodes.polySurface947_tree1_0.geometry}
        material={materials.PaletteMaterial001}
      />
      <mesh
        geometry={nodes.polySurface948_tree_body_0.geometry}
        material={materials.PaletteMaterial001}
      />
      <mesh
        geometry={nodes.polySurface949_tree_body_0.geometry}
        material={materials.PaletteMaterial001}
      />
      <mesh
        geometry={nodes.pCube11_rocks1_0.geometry}
        material={materials.PaletteMaterial001}
      />
    </a.group>
  );
}
