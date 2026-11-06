import * as THREE from "three";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function handleResize(
  renderer: THREE.WebGLRenderer,
  camera: THREE.PerspectiveCamera,
  canvasDiv: React.RefObject<HTMLDivElement>,
  _character: THREE.Object3D
) {
  if (!canvasDiv.current) return;
  const canvas3d = canvasDiv.current.getBoundingClientRect();
  const width = canvas3d.width;
  const height = canvas3d.height;
  renderer.setSize(width, height);
  const aspect = width / height;
  camera.aspect = aspect;
  if (aspect < 1.2) {
    camera.position.z = 24.8 * (1.2 / Math.max(aspect, 0.6));
  } else {
    camera.position.z = 24.8;
  }
  camera.updateProjectionMatrix();
  ScrollTrigger.refresh();
}
