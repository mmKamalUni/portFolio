"use client";
import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import { motion } from "framer-motion";
import clsx from "clsx";

type Props = {
  className?: string;
};

type Particle = {
  sprite: THREE.Sprite;
  velocity: THREE.Vector3;
  lifespan: number; // seconds
  age: number; // seconds
  baseScale: number;
};

export default function BackgroundAnimation({ className }: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const composerRef = useRef<EffectComposer | null>(null);
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef(new THREE.Vector2(0, 0));
  // Avoid accessing window during SSR: initialize safely and update after mount
  const [isMobile, setIsMobile] = useState(false);
  const isMobileRef = useRef(false);
  const targetFpsRef = useRef(60);

  useEffect(() => {
    const container = containerRef.current!;

    // Scene and camera
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      1,
      2000
    );
    camera.position.set(0, 0, 400);
    cameraRef.current = camera;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    rendererRef.current = renderer;
    renderer.domElement.style.width = "100%";
    renderer.domElement.style.height = "100%";
    renderer.domElement.style.display = "block";
    renderer.domElement.style.pointerEvents = "none";
    container.appendChild(renderer.domElement);

    // Explicitly set clear color to transparent to avoid any black flashes
    renderer.setClearColor(0x000000, 0);

    // Light (for completeness, though sprites are unlit)
    const light = new THREE.PointLight(0xffffff, 0.4);
    light.position.set(0, 0, 400);
    scene.add(light);

    // Postprocessing with bloom
    const renderPass = new RenderPass(scene, camera);
    const bloomPass = new UnrealBloomPass(
      new THREE.Vector2(window.innerWidth, window.innerHeight),
      0.8, // strength
      0.6, // radius
      0.01 // threshold
    );
    const composer = new EffectComposer(renderer);
    composer.addPass(renderPass);
    composer.addPass(bloomPass);
    composerRef.current = composer;

    // Sprite texture (radial gradient circle)
    const createSpriteTexture = () => {
      const size = 128;
      const canvas = document.createElement("canvas");
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext("2d")!;
      const gradient = ctx.createRadialGradient(
        size / 2,
        size / 2,
        0,
        size / 2,
        size / 2,
        size / 2
      );
      gradient.addColorStop(0, "rgba(255,255,255,1)");
      gradient.addColorStop(0.4, "rgba(255,255,255,0.6)");
      gradient.addColorStop(1, "rgba(255,255,255,0)");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, size, size);
      const texture = new THREE.CanvasTexture(canvas);
      texture.minFilter = THREE.LinearFilter;
      texture.magFilter = THREE.LinearFilter;
      return texture;
    };

    const spriteMap = createSpriteTexture();

    // Create particles
    const particles: Particle[] = [];
    const count = 500;
    const colors = [new THREE.Color("#00E5FF"), new THREE.Color("#8A2BE2")];
    for (let i = 0; i < count; i++) {
      const color = colors[i % 2];
      const material = new THREE.SpriteMaterial({
        map: spriteMap,
        color,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });
      const sprite = new THREE.Sprite(material);
      const baseScale = 6 + Math.random() * 10; // size in world units
      sprite.scale.set(baseScale, baseScale, 1);
      // distribute in a box around origin
      sprite.position.set(
        (Math.random() - 0.5) * 800,
        (Math.random() - 0.5) * 600,
        (Math.random() - 0.5) * 200
      );
      scene.add(sprite);

      // velocity 0.5-1.5 units/sec in random direction
      const speed = 0.5 + Math.random();
      const dir = new THREE.Vector3(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5)
        .normalize()
        .multiplyScalar(speed);

      const lifespan = 10 + Math.random() * 10; // 10-20s
      particles.push({ sprite, velocity: dir, lifespan, age: Math.random() * lifespan, baseScale });
    }
    particlesRef.current = particles;

    // Initialize mobile state and target FPS once on mount
    const initMobile = window.innerWidth < 768;
    setIsMobile(initMobile);
    isMobileRef.current = initMobile;
    targetFpsRef.current = initMobile ? 30 : 60;

    // Resize handling (now updates isMobile and target FPS too)
    const onResize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      const m = w < 768;
      setIsMobile(m);
      isMobileRef.current = m;
      targetFpsRef.current = m ? 30 : 60;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
      composer.setSize(w, h);
    };
    window.addEventListener("resize", onResize);

    // Mouse handling (normalized to world plane at z=0 approximately)
    const onMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = -(e.clientY / window.innerHeight) * 2 + 1;
      mouseRef.current.set(x, y);
    };
    window.addEventListener("mousemove", onMouseMove, { passive: true });

    let accumulatedTime = 0; // For delta-based throttling (renders only when enough time passed)

    const clock = new THREE.Clock();

    const animate = (time: number) => {
      rafRef.current = requestAnimationFrame(animate);
      const delta = clock.getDelta(); // Always get delta for consistent updates
      accumulatedTime += delta;

      // Throttle renders (but always update particles for smoothness)
      const frameTime = 1 / targetFpsRef.current;
      if (accumulatedTime >= frameTime) {
        // Compute approximate mouse world position on z=0 plane
        const mouseNDC = new THREE.Vector3(mouseRef.current.x, mouseRef.current.y, 0.5);
        mouseNDC.unproject(camera);
        const dir = mouseNDC.sub(camera.position).normalize();
        let mouseWorld;
        if (dir.z !== 0) { // Guard against rare div-by-zero
          const distance = -camera.position.z / dir.z;
          mouseWorld = camera.position.clone().add(dir.multiplyScalar(distance));
        } else {
          mouseWorld = new THREE.Vector3(0, 0, 0); // Fallback
        }

        // Update particles (always, even on skipped renders)
        const bounds = new THREE.Box3(
          new THREE.Vector3(-420, -320, -200),
          new THREE.Vector3(420, 320, 200)
        );
        const repulsionRadius = 60;
        const repulsionStrength = 6; // small push
        for (const p of particlesRef.current) {
          // Age and lifespan fade: ease in/out over lifespan
          p.age += delta;
          if (p.age > p.lifespan) p.age = 0; // loop
          const t = p.age / p.lifespan; // 0..1
          // Smooth fade in/out using sinusoidal curve
          const fade = Math.sin(t * Math.PI);
          const material = p.sprite.material as THREE.SpriteMaterial;
          material.opacity = 0.3 * fade; // base visual; overall container fades to 0.1 via CSS/motion
          const scale = p.baseScale * (0.6 + 0.8 * fade);
          p.sprite.scale.set(scale, scale, 1);

          // Mouse repulsion (X/Y only) - with NaN guard
          const dx = p.sprite.position.x - mouseWorld.x;
          const dy = p.sprite.position.y - mouseWorld.y;
          const distSq = dx * dx + dy * dy;
          if (distSq < repulsionRadius * repulsionRadius && distSq > 0) { // Avoid div-by-zero
            const d = Math.sqrt(distSq);
            const nx = dx / d;
            const ny = dy / d;
            p.velocity.x += nx * repulsionStrength * delta;
            p.velocity.y += ny * repulsionStrength * delta;
          }

          // Integrate velocity - with NaN guard
          const velocityDelta = p.velocity.clone().multiplyScalar(delta * 20);
          if (!isNaN(velocityDelta.x) && !isNaN(velocityDelta.y) && !isNaN(velocityDelta.z)) {
            p.sprite.position.add(velocityDelta);
          }

          // Soft bounds reflect - with NaN guard
          const pos = p.sprite.position;
          if (!isNaN(pos.x) && !isNaN(pos.y) && !isNaN(pos.z)) {
            if (!bounds.containsPoint(pos)) {
              if (pos.x < bounds.min.x || pos.x > bounds.max.x) p.velocity.x *= -1;
              if (pos.y < bounds.min.y || pos.y > bounds.max.y) p.velocity.y *= -1;
              if (pos.z < bounds.min.z || pos.z > bounds.max.z) p.velocity.z *= -1;
            }
          }
        }

        composer.render();
        accumulatedTime = 0; // Reset after render
      }
    };
    animate(0); // Initial call

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("mousemove", onMouseMove);
      // Cleanup Three.js objects
      particlesRef.current.forEach((p) => {
        scene.remove(p.sprite);
        (p.sprite.material as THREE.Material).dispose();
      });
      spriteMap.dispose();
      composer.dispose();
      renderer.dispose();
      container.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <motion.div
      ref={containerRef}
      className={clsx(
        "pointer-events-none fixed inset-0 z-[-10]",
        className
      )}
      initial={{ opacity: 0 }}
      animate={{ opacity: 0.1 }}
      transition={{ duration: 2, ease: "easeOut" }}
    />
  );
}