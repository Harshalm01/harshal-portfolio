/* eslint-disable @typescript-eslint/no-explicit-any */
import * as THREE from "three";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function setCharTimeline(
  character: THREE.Object3D<THREE.Object3DEventMap> | null,
  camera: THREE.PerspectiveCamera
) {
  let intensity: number = 0;
  setInterval(() => {
    intensity = Math.random();
  }, 200);
  const tl1 = gsap.timeline({
    scrollTrigger: {
      trigger: ".landing-section",
      start: "top top",
      end: "bottom top",
      scrub: true,
      invalidateOnRefresh: true,
    },
    defaults: { ease: "none" },
  });
  const tl2 = gsap.timeline({
    scrollTrigger: {
      trigger: ".about-section",
      start: "center 50%",
      end: "bottom top",
      scrub: true,
      invalidateOnRefresh: true,
    },
    defaults: { ease: "none" },
  });
  const tl3 = gsap.timeline({
    scrollTrigger: {
      trigger: ".whatIDO",
      start: "top top",
      end: "bottom top",
      scrub: true,
      invalidateOnRefresh: true,
    },
    defaults: { ease: "none" },
  });
  let screenLight: any, monitor: any;
  character?.children.forEach((object: any) => {
    if (object.name === "Plane004") {
      object.children.forEach((child: any) => {
        child.material.transparent = true;
        child.material.opacity = 0;
        if (child.material.name === "Material.027") {
          monitor = child;
          child.material.color.set("#FFFFFF");
        }
      });
    }
    if (object.name === "screenlight") {
      object.material.transparent = true;
      object.material.opacity = 0;
      object.material.emissive.set("#C8BFFF");
      gsap.timeline({ repeat: -1, repeatRefresh: true }).to(object.material, {
        emissiveIntensity: () => intensity * 8,
        duration: () => Math.random() * 0.6,
        delay: () => Math.random() * 0.1,
      });
      screenLight = object;
    }
  });
  const neckBone = character?.getObjectByName("spine005");
  if (window.innerWidth > 1024) {
    if (character) {
      gsap.set(".character-model", { xPercent: -50, x: 0 });
      gsap.set(".landing-container", { autoAlpha: 1, y: "0%" });

      tl1
        .fromTo(character.rotation, { y: 0 }, { y: 0.6, duration: 1 }, 0)
        .to(camera.position, { z: 24.5, y: 13.0, duration: 1 }, 0)
        .fromTo(
          ".character-model",
          { xPercent: -50, x: 0 },
          { xPercent: -50, x: "-26vw", duration: 1 },
          0
        )
        // Clean Hero exit: Fades out and translates slightly upward early, guaranteeing zero overlap with About
        .to(
          ".landing-container",
          { autoAlpha: 0, y: "-40px", duration: 0.35, ease: "power2.in" },
          0
        )
        // Clean About entrance: Starts only after Hero container is completely hidden
        .fromTo(
          ".about-me",
          { autoAlpha: 0, y: "40px" },
          { autoAlpha: 1, y: "0px", duration: 0.55, ease: "power2.out" },
          0.45
        );

      tl2
        .to(camera.position, { z: 75, y: 8.4, duration: 2 }, 0)
        .to(".about-section", { y: "15%", opacity: 0, duration: 1.5 }, 0)
        .fromTo(
          ".character-model",
          { pointerEvents: "inherit", xPercent: -50, x: "-26vw" },
          { pointerEvents: "none", xPercent: -50, x: "-12vw", duration: 2 },
          0
        )
        .to(character.rotation, { y: 0.92, x: 0.12, duration: 2 }, 0)
        .to(neckBone!.rotation, { x: 0.6, duration: 2 }, 0)
        .to(monitor.material, { opacity: 1, duration: 1 }, 0.5)
        .to(screenLight.material, { opacity: 1, duration: 1 }, 0.8)
        .fromTo(
          ".what-box-in",
          { autoAlpha: 0, x: 40 },
          { autoAlpha: 1, x: 0, duration: 0.6, ease: "power2.out" },
          0.8
        )
        .fromTo(
          monitor.position,
          { y: -10, z: 2 },
          { y: 0, z: 0, duration: 2 },
          0
        )
        .fromTo(
          ".character-rim",
          { opacity: 1, scaleX: 1.4 },
          { opacity: 0, scale: 0, y: "-70%", duration: 2 },
          0
        );

      tl3
        .fromTo(
          ".character-model",
          { y: "0%", xPercent: -50 },
          { y: "-100%", xPercent: -50, duration: 2 },
          0
        )
        .fromTo(".whatIDO", { y: 0 }, { y: "15%", duration: 2 }, 0)
        .to(character.rotation, { x: -0.04, duration: 2 }, 0);
    }
  } else {
    if (character) {
      const tM2 = gsap.timeline({
        scrollTrigger: {
          trigger: ".what-box-in",
          start: "top 70%",
          end: "bottom top",
        },
      });
      tM2.to(".what-box-in", { display: "flex", duration: 0.1, delay: 0 }, 0);
    }
  }
}

export function setAllTimeline() {
  // Scoped animations are directly managed within Career.tsx and Work.tsx.
  // Refresh ScrollTrigger to ensure trigger coordinates stay in sync.
  ScrollTrigger.refresh();
}
