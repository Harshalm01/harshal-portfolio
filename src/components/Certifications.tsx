import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import * as THREE from "three";
import {
  MdClose,
  MdChevronLeft,
  MdChevronRight,
  MdTouchApp,
} from "react-icons/md";
import { certificatesData, CertificateItem } from "./certificatesData";
import ScrollIndicator from "./ScrollIndicator";
import "./styles/Certifications.css";

const Certifications: React.FC = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [activeCert, setActiveCert] = useState<CertificateItem | null>(null);
  const [activeIdx, setActiveIdx] = useState<number>(0);

  // Modal open/close handlers
  const openModal = (cert: CertificateItem, idx: number) => {
    setActiveCert(cert);
    setActiveIdx(idx);
    document.body.style.overflow = "hidden";
  };

  const closeModal = () => {
    setActiveCert(null);
    document.body.style.overflow = "";
    document.body.style.overflowY = "auto";
  };

  const nextCert = () => {
    const nextIndex = (activeIdx + 1) % certificatesData.length;
    setActiveIdx(nextIndex);
    setActiveCert(certificatesData[nextIndex]);
  };

  const prevCert = () => {
    const prevIndex =
      (activeIdx - 1 + certificatesData.length) % certificatesData.length;
    setActiveIdx(prevIndex);
    setActiveCert(certificatesData[prevIndex]);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!activeCert) return;
      if (e.key === "Escape") closeModal();
      if (e.key === "ArrowRight") nextCert();
      if (e.key === "ArrowLeft") prevCert();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeCert, activeIdx]);

  // Ref for Left / Right navigation buttons
  const rotateStepRef = useRef<(dir: number) => void>(() => { });

  // --------------------------------------------------------------------------
  // EXACT 3D CIRCULAR WEBGL GALLERY ENGINE
  // Matching Harshal's Aerqon Aviation Flight Gallery (3D Cylindrical WebGL)
  // --------------------------------------------------------------------------
  useEffect(() => {
    const container = containerRef.current;
    if (!container || typeof window === "undefined" || certificatesData.length === 0) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const width = container.clientWidth;
    const height = container.clientHeight;

    // 1. Scene & Camera Setup (Aerqon exact geometry)
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);

    const updateCameraZ = () => {
      if (window.innerWidth < 480) {
        camera.position.z = 15.5;
      } else if (window.innerWidth < 768) {
        camera.position.z = 13.5;
      } else {
        camera.position.z = 11.6;
      }
    };
    updateCameraZ();

    // 2. High-performance WebGL Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.innerHTML = "";
    container.appendChild(renderer.domElement);

    // 3. Curved Cylinder Vertex Shader (Exact Aerqon Math)
    const vertexShader = `
      uniform float uBend;
      uniform float uRadius;
      varying vec2 vUv;

      void main() {
          vUv = uv;
          vec3 pos = position;
          float angle = pos.x / uRadius;
          pos.z += cos(angle * uBend) * 0.35;
          pos.x = sin(angle * uBend) * uRadius;

          vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
          gl_Position = projectionMatrix * mvPosition;
      }
    `;

    // 4. Fragment Shader with Clean Rounded Borders (No Text Overlay)
    const fragmentShader = `
      uniform sampler2D uTexture;
      uniform float uBorderRadius;
      uniform float uPlaneAspect;
      uniform float uImageAspect;
      uniform float uHover;
      varying vec2 vUv;

      float roundedBoxSDF(vec2 p, vec2 b, float r) {
          vec2 d = abs(p) - b + vec2(r);
          return min(max(d.x, d.y), 0.0) + length(max(d, 0.0)) - r;
      }

      void main() {
          vec2 st = vUv;
          
          // Aspect-correct contain letterboxing: NO certificate text is ever cropped
          vec2 scale = vec2(
              max(1.0, uPlaneAspect / uImageAspect),
              max(1.0, uImageAspect / uPlaneAspect)
          );
          vec2 uv = (st - vec2(0.5)) * scale + vec2(0.5);

          vec4 cardBg = vec4(0.06, 0.04, 0.10, 1.0);
          vec4 texColor = cardBg;

          if (uv.x >= 0.0 && uv.x <= 1.0 && uv.y >= 0.0 && uv.y <= 1.0) {
              texColor = texture2D(uTexture, uv);
          }

          vec4 baseColor = mix(cardBg, texColor, texColor.a);

          vec2 boxSt = st - vec2(0.5);
          float dist = roundedBoxSDF(boxSt, vec2(0.485), uBorderRadius);
          float alpha = smoothstep(0.005, 0.0, dist);

          // Subtle glowing purple border
          float borderDist = abs(dist);
          float borderFactor = smoothstep(0.012, 0.0, borderDist);
          vec3 borderCol = mix(vec3(0.76, 0.64, 1.0), vec3(0.66, 0.33, 0.97), st.y);
          if (uHover > 0.5) {
              borderCol = mix(borderCol, vec3(1.0, 1.0, 1.0), 0.6);
          }

          vec4 finalColor = baseColor;
          finalColor.rgb = mix(finalColor.rgb, borderCol, borderFactor * (0.8 + uHover * 0.35));

          gl_FragColor = vec4(finalColor.rgb, alpha);
      }
    `;

    const textureLoader = new THREE.TextureLoader();
    const galleryGroup = new THREE.Group();
    scene.add(galleryGroup);

    // Aerqon Cylinder Dimensions: radius 7.2, cards 4.3 x 4.0 (same breadth, increased height)
    const radius = 7.2;
    const itemCount = certificatesData.length;
    const meshes: THREE.Mesh<THREE.PlaneGeometry, THREE.ShaderMaterial>[] = [];
    const planeWidth = 4.0;
    const planeHeight = 4.2;
    const planeAspect = planeWidth / planeHeight;

    certificatesData.forEach((item, index) => {
      const angle = (index / itemCount) * Math.PI * 2;
      const geometry = new THREE.PlaneGeometry(planeWidth, planeHeight, 20, 20);

      const material = new THREE.ShaderMaterial({
        vertexShader,
        fragmentShader,
        uniforms: {
          uTexture: { value: null },
          uBend: { value: 1.4 },
          uRadius: { value: radius },
          uBorderRadius: { value: 0.05 },
          uPlaneAspect: { value: planeAspect },
          uImageAspect: { value: 1.34 },
          uHover: { value: 0.0 },
        },
        transparent: true,
        side: THREE.DoubleSide,
      });

      textureLoader.load(
        item.image,
        (imgTexture) => {
          imgTexture.minFilter = THREE.LinearFilter;
          imgTexture.generateMipmaps = false;
          const img = imgTexture.image;
          if (img && img.width && img.height) {
            material.uniforms.uImageAspect.value = img.width / img.height;
          }
          material.uniforms.uTexture.value = imgTexture;
          material.needsUpdate = true;
        },
        undefined,
        (err) => {
          console.warn(`Could not load certificate texture ${item.image}:`, err);
        }
      );

      const mesh = new THREE.Mesh(geometry, material);
      mesh.userData = {
        baseAngle: angle,
        itemIndex: index,
        certItem: item,
      };

      mesh.position.x = Math.sin(angle) * radius;
      mesh.position.z = Math.cos(angle) * radius - radius;
      mesh.rotation.y = angle;

      galleryGroup.add(mesh);
      meshes.push(mesh);
    });

    // --------------------------------------------------------------------------
    // Rotation & Interaction Logic (Aerqon Physics)
    // --------------------------------------------------------------------------
    let targetRotation = 0;
    let currentRotation = 0;
    let isDragging = false;
    let startX = 0;
    let startY = 0;
    let startTime = 0;
    let previousRotation = 0;
    let isHovered = false;

    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const handlePointerDown = (clientX: number, clientY: number) => {
      isDragging = true;
      startX = clientX;
      startY = clientY;
      startTime = Date.now();
      previousRotation = targetRotation;
      container.style.cursor = "grabbing";
    };

    const handlePointerMove = (clientX: number) => {
      if (!isDragging) return;
      const deltaX = clientX - startX;
      targetRotation = previousRotation + deltaX * 0.005;
    };

    const handlePointerUp = (clientX: number, clientY: number) => {
      if (isDragging) {
        isDragging = false;
        container.style.cursor = "grab";

        const moveDist = Math.hypot(clientX - startX, clientY - startY);
        const duration = Date.now() - startTime;

        // Click / tap detection to open modal
        if (moveDist < 8 && duration < 350) {
          const rect = container.getBoundingClientRect();
          mouse.x = ((clientX - rect.left) / rect.width) * 2 - 1;
          mouse.y = -((clientY - rect.top) / rect.height) * 2 + 1;

          raycaster.setFromCamera(mouse, camera);
          const intersects = raycaster.intersectObjects(meshes);

          if (intersects.length > 0) {
            const hit = intersects[0].object;
            const certData = hit.userData.certItem as CertificateItem;
            const certIdx = hit.userData.itemIndex as number;
            if (certData) {
              openModal(certData, certIdx);
            }
          }
        }
      }
    };

    // Mouse Listeners
    const onMouseDown = (e: MouseEvent) => {
      handlePointerDown(e.clientX, e.clientY);
    };

    const onMouseMove = (e: MouseEvent) => {
      handlePointerMove(e.clientX);

      if (!isDragging) {
        const rect = container.getBoundingClientRect();
        mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects(meshes);
        meshes.forEach((m) => (m.material.uniforms.uHover.value = 0.0));
        if (intersects.length > 0) {
          (intersects[0].object as THREE.Mesh<
            THREE.PlaneGeometry,
            THREE.ShaderMaterial
          >).material.uniforms.uHover.value = 1.0;
        }
      }
    };

    const onMouseUp = (e: MouseEvent) => {
      handlePointerUp(e.clientX, e.clientY);
    };

    const onMouseEnter = () => {
      isHovered = true;
      container.style.cursor = "grab";
    };

    const onMouseLeave = () => {
      isHovered = false;
      isDragging = false;
      container.style.cursor = "default";
      meshes.forEach((m) => (m.material.uniforms.uHover.value = 0.0));
    };

    // Touch Listeners
    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        handlePointerDown(e.touches[0].clientX, e.touches[0].clientY);
      }
    };

    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        handlePointerMove(e.touches[0].clientX);
      }
    };

    const onTouchEnd = (e: TouchEvent) => {
      const touch = e.changedTouches[0] || e.touches[0];
      if (touch) {
        handlePointerUp(touch.clientX, touch.clientY);
      } else {
        isDragging = false;
      }
    };

    // Passive wheel listener: DOES NOT prevent page scrolling!
    // Allows 100% smooth global page scroll while subtly influencing 3D rotation
    const onWheel = (e: WheelEvent) => {
      targetRotation += e.deltaY * 0.0008;
    };

    container.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    container.addEventListener("mouseenter", onMouseEnter);
    container.addEventListener("mouseleave", onMouseLeave);
    container.addEventListener("wheel", onWheel, { passive: true });

    container.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("touchend", onTouchEnd, { passive: true });

    // Step rotate functions for Prev / Next controls
    // Corrected direction: Right button advances to next certificate from the right
    rotateStepRef.current = (dir: number) => {
      const step = (Math.PI * 2) / itemCount;
      targetRotation += dir * step;
    };

    // --------------------------------------------------------------------------
    // Animation Loop & Viewport Observer
    // --------------------------------------------------------------------------
    let isGalleryVisible = false;
    let animationFrameId: number | null = null;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      // Smooth lerp easing (exact Aerqon 0.08)
      currentRotation += (targetRotation - currentRotation) * 0.08;

      meshes.forEach((mesh) => {
        const angle = mesh.userData.baseAngle + currentRotation;
        mesh.position.x = Math.sin(angle) * radius;
        mesh.position.z = Math.cos(angle) * radius - radius;
        mesh.rotation.y = angle;
      });

      // Continuous automatic rotation when not dragging or hovered
      if (!isDragging && !prefersReducedMotion && !isHovered) {
        targetRotation += 0.003;
      }

      renderer.render(scene, camera);
    };

    const galleryObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          isGalleryVisible = entry.isIntersecting;
          if (isGalleryVisible) {
            if (!animationFrameId) animate();
          } else {
            if (animationFrameId) {
              cancelAnimationFrame(animationFrameId);
              animationFrameId = null;
            }
          }
        });
      },
      { threshold: 0.05 }
    );

    galleryObserver.observe(container);

    // Responsive Resize Handler
    const onResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      updateCameraZ();
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener("resize", onResize);

    return () => {
      galleryObserver.disconnect();
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
      container.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
      container.removeEventListener("mouseenter", onMouseEnter);
      container.removeEventListener("mouseleave", onMouseLeave);
      container.removeEventListener("wheel", onWheel);
      container.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
      window.removeEventListener("resize", onResize);
      renderer.dispose();
      meshes.forEach((m) => {
        m.geometry.dispose();
        m.material.dispose();
      });
      container.innerHTML = "";
    };
  }, []);

  return (
    <section
      className="certifications-section"
      id="certifications"
      aria-label="Professional Certifications & Credentials"
    >
      <div className="certifications-container">
        {/* Section Header */}
        <div className="certifications-header">
          <div className="certifications-badge">
            <span className="badge-pulse-dot" />
            <span>06 // 3D CIRCULAR CREDENTIALS GALLERY</span>
          </div>
          <h2 className="certifications-title">
            Professional <span>Certifications &amp; Vault</span>
          </h2>
          <p className="certifications-subtitle">
            A real-time 3D circular cylinder exhibition of industry-verified engineering credentials,
            internships, and executive recommendations. Drag or scroll to rotate · Click any certificate to inspect.
          </p>
        </div>

        {/* 3D Circular WebGL Exhibition Track */}
        <div className="circular-certs-viewport">
          {/* Ambient Purple Backdrop Glow */}
          <div className="circular-certs-glow" />

          {/* WebGL Canvas Container */}
          <div
            id="circular-certificates-container"
            className="circular-certs-canvas"
            ref={containerRef}
            title="Drag to rotate 3D cylindrical gallery · Click any certificate to inspect full resolution"
          />

          {/* Side Rotation Chevrons (Corrected direction: Left -> -1, Right -> +1) */}
          <button
            type="button"
            className="circular-cert-arrow prev"
            onClick={() => rotateStepRef.current(-1)}
            aria-label="Rotate to previous certificate"
          >
            <MdChevronLeft />
          </button>

          <button
            type="button"
            className="circular-cert-arrow next"
            onClick={() => rotateStepRef.current(1)}
            aria-label="Rotate to next certificate"
          >
            <MdChevronRight />
          </button>

          {/* Drag & Touch Hint */}
          <div className="circular-certs-hint">
            <MdTouchApp className="hint-icon" />
            <span>DRAG TO ROTATE 360° · CLICK TO ENLARGE</span>
          </div>
        </div>
      </div>

      {/* Full-Screen Certificate Lightbox Modal */}
      {activeCert &&
        createPortal(
          <div
            className="cert-lightbox-backdrop"
            onClick={closeModal}
            role="dialog"
            aria-modal="true"
            aria-label={`${activeCert.title} Credential Preview`}
          >
            <div
              className="cert-lightbox-modal"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="cert-lightbox-header">
                <div className="cert-lightbox-title-wrap">
                  <span className="cert-lightbox-counter">
                    0{activeIdx + 1} / 0{certificatesData.length}
                  </span>
                  <div>
                    <h3 className="cert-lightbox-heading">
                      {activeCert.title}
                    </h3>
                    <p className="cert-lightbox-sub">
                      {activeCert.issuer} &nbsp;·&nbsp; {activeCert.date}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  className="cert-lightbox-close"
                  onClick={closeModal}
                  aria-label="Close modal"
                >
                  <MdClose />
                </button>
              </div>

              {/* Modal Body: Uncropped Original Certificate */}
              <div className="cert-lightbox-body">
                <img
                  src={activeCert.image}
                  alt={activeCert.title}
                  className="cert-lightbox-img"
                />
              </div>

              {/* Modal Footer */}
              <div className="cert-lightbox-footer">
                <p className="cert-lightbox-desc">
                  {activeCert.description}
                </p>

                <div className="cert-lightbox-nav-buttons">
                  <button
                    type="button"
                    className="cert-nav-btn prev"
                    onClick={prevCert}
                    aria-label="Previous certificate"
                  >
                    <MdChevronLeft /> Prev
                  </button>
                  <button
                    type="button"
                    className="cert-nav-btn next"
                    onClick={nextCert}
                    aria-label="Next certificate"
                  >
                    Next <MdChevronRight />
                  </button>
                </div>
              </div>
            </div>
          </div>,
          document.body
        )}

      <ScrollIndicator targetId="techstack" label="SCROLL TO TECH STACK" />
    </section>
  );
};

export default Certifications;
