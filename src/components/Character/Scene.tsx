import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import setCharacter from "./utils/character";
import setLighting from "./utils/lighting";
import handleResize from "./utils/resizeUtils";
import {
  handleMouseMove,
  handleTouchEnd,
  handleHeadRotation,
  handleTouchMove,
} from "./utils/mouseUtils";
import setAnimations from "./utils/animationUtils";
import Loading from "../Loading";

const Scene = () => {
  const canvasDiv = useRef<HTMLDivElement | null>(null);
  const hoverDivRef = useRef<HTMLDivElement>(null);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const [, setChar] = useState<THREE.Object3D | null>(null);
  useEffect(() => {
    if (canvasDiv.current) {
      // Clear any previous canvas element to prevent double characters
      while (canvasDiv.current.firstChild) {
        canvasDiv.current.removeChild(canvasDiv.current.firstChild);
      }

      let isMounted = true;
      const rect = canvasDiv.current.getBoundingClientRect();
      const container = { width: rect.width, height: rect.height };
      const aspect = container.width / container.height;
      const scene = new THREE.Scene();

      const renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
        powerPreference: "high-performance",
      });
      renderer.setSize(container.width, container.height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1;
      canvasDiv.current.appendChild(renderer.domElement);

      const camera = new THREE.PerspectiveCamera(14.5, aspect, 0.1, 1000);
      camera.position.set(0, 13.0, 24.8);
      camera.zoom = 1.05;
      camera.updateProjectionMatrix();

      let headBone: THREE.Object3D | null = null;
      let screenLight: THREE.Object3D | null = null;
      let mixer: THREE.AnimationMixer;
      let onResize: (() => void) | null = null;

      const clock = new THREE.Clock();

      const light = setLighting(scene);

      // Progress callback for actual model loading
      const onProgress = (progress: number) => {
        setLoadingProgress(Math.round(progress));
        if (progress >= 100) {
          setTimeout(() => {
            if (isMounted) setIsLoading(false);
          }, 3500);
        }
      };

      const { loadCharacter } = setCharacter(
        renderer,
        scene,
        camera,
        onProgress
      );

      loadCharacter().then((gltf) => {
        if (!isMounted || !gltf) return;
        scene.clear();
        const animations = setAnimations(gltf);
        hoverDivRef.current && animations.hover(gltf, hoverDivRef.current);
        mixer = animations.mixer;
        const character = gltf.scene;

        character.traverse((child: THREE.Object3D) => {
          if ((child as any).isSkinnedMesh) {
            child.frustumCulled = false;
          }
        });

        setChar(character);
        scene.add(character);
        headBone = character.getObjectByName("spine006") || null;
        screenLight = character.getObjectByName("screenlight") || null;

        setTimeout(() => {
          if (!isMounted) return;
          light.turnOnLights();
          animations.startIntro();
        }, 1500);

        onResize = () =>
          handleResize(renderer, camera, canvasDiv, character);
        window.addEventListener("resize", onResize);
      });

      let mouse = { x: 0, y: 0 },
        interpolation = { x: 0.1, y: 0.2 };

      const onMouseMove = (event: MouseEvent) => {
        handleMouseMove(event, (x, y) => (mouse = { x, y }));
      };
      let debounce: number | undefined;
      const onTouchStart = (event: TouchEvent) => {
        const element = event.target as HTMLElement;
        debounce = setTimeout(() => {
          element?.addEventListener("touchmove", (e: TouchEvent) =>
            handleTouchMove(e, (x, y) => (mouse = { x, y }))
          );
        }, 200);
      };

      const onTouchEnd = () => {
        handleTouchEnd((x, y, interpolationX, interpolationY) => {
          mouse = { x, y };
          interpolation = { x: interpolationX, y: interpolationY };
        });
      };

      document.addEventListener("mousemove", (event) => {
        onMouseMove(event);
      });
      const landingDiv = document.getElementById("landingDiv");
      if (landingDiv) {
        landingDiv.addEventListener("touchstart", onTouchStart);
        landingDiv.addEventListener("touchend", onTouchEnd);
      }
      let isVisible = true;
      const visibilityObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            isVisible = entry.isIntersecting;
          });
        },
        { rootMargin: "250px 0px 250px 0px", threshold: 0 }
      );
      if (canvasDiv.current) {
        visibilityObserver.observe(canvasDiv.current);
      }

      let reqId: number;
      const animate = () => {
        reqId = requestAnimationFrame(animate);
        if (!isVisible) return;
        if (headBone) {
          handleHeadRotation(
            headBone,
            mouse.x,
            mouse.y,
            interpolation.x,
            interpolation.y,
            THREE.MathUtils.lerp
          );
          light.setPointLight(screenLight);
        }
        const delta = clock.getDelta();
        if (mixer) {
          mixer.update(delta);
        }
        renderer.render(scene, camera);
      };
      animate();
      return () => {
        cancelAnimationFrame(reqId);
        visibilityObserver.disconnect();
        clearTimeout(debounce);
        scene.clear();
        renderer.dispose();
        if (onResize) {
          window.removeEventListener("resize", onResize);
        }
        if (canvasDiv.current) {
          canvasDiv.current.removeChild(renderer.domElement);
        }
        if (landingDiv) {
          document.removeEventListener("mousemove", onMouseMove);
          landingDiv.removeEventListener("touchstart", onTouchStart);
          landingDiv.removeEventListener("touchend", onTouchEnd);
        }
      };
    }
  }, []);

  return (
    <>
      {isLoading && <Loading percent={loadingProgress} />}
      <div className="character-container">
        <div className="character-model" ref={canvasDiv}>
          <div className="character-rim"></div>
          <div className="character-hover" ref={hoverDivRef}></div>
        </div>
      </div>
    </>
  );
};

export default Scene;
