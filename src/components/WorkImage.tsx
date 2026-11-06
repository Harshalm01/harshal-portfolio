import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import {
  MdArrowOutward,
  MdChevronLeft,
  MdChevronRight,
  MdClose,
  MdFullscreen,
  MdCloudUpload,
} from "react-icons/md";

export interface GalleryItem {
  image: string;
  title: string;
  desc?: string;
}

export interface PortalExperience {
  id: string;
  label: string;
  subLabel?: string;
  url: string;
  buttonText: string;
  gallery: GalleryItem[];
}

interface Props {
  image?: string;
  alt?: string;
  video?: string;
  link?: string;
  gallery?: GalleryItem[];
  portals?: PortalExperience[];
  imageFit?: "contain" | "cover";
}

const WorkImage = (props: Props) => {
  const [isVideo, setIsVideo] = useState(false);
  const [video, setVideo] = useState("");
  const [activePortalIdx, setActivePortalIdx] = useState(0);
  const [activeIdx, setActiveIdx] = useState(0);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [transitionDir, setTransitionDir] = useState<"next" | "prev">("next");
  const [imgLoadError, setImgLoadError] = useState(false);

  const isDualPortal = Boolean(props.portals && props.portals.length > 0);
  const currentPortal = isDualPortal ? props.portals![activePortalIdx] : null;

  const currentGallery: GalleryItem[] | undefined = isDualPortal
    ? currentPortal?.gallery
    : props.gallery;

  const hasGallery = Boolean(currentGallery && currentGallery.length > 0);

  const currentImage = hasGallery
    ? currentGallery![activeIdx]?.image || ""
    : props.image || "";

  const currentTitle = hasGallery
    ? currentGallery![activeIdx]?.title || ""
    : props.alt || "";

  // Reset index and error state when switching portal tabs
  useEffect(() => {
    setActiveIdx(0);
    setImgLoadError(false);
  }, [activePortalIdx]);

  // Reset error state on slide index change
  useEffect(() => {
    setImgLoadError(false);
  }, [activeIdx]);

  // Preload primary and adjacent screenshots to ensure instantaneous, flicker-free carousel navigation
  useEffect(() => {
    if (props.image) {
      const img = new Image();
      img.src = props.image;
    }
    if (!hasGallery || !currentGallery || currentGallery.length <= 1) return;
    const nextIdx = (activeIdx + 1) % currentGallery.length;
    const prevIdx =
      (activeIdx - 1 + currentGallery.length) % currentGallery.length;
    const imgNext = new Image();
    imgNext.src = currentGallery[nextIdx].image;
    const imgPrev = new Image();
    imgPrev.src = currentGallery[prevIdx].image;
  }, [activeIdx, hasGallery, currentGallery, props.image]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isPreviewOpen) return;
      if (e.key === "Escape") setIsPreviewOpen(false);
      if (e.key === "ArrowLeft" && hasGallery) {
        handlePrevStep();
      }
      if (e.key === "ArrowRight" && hasGallery) {
        handleNextStep();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isPreviewOpen, hasGallery, activeIdx, isTransitioning, currentGallery]);

  const handleMouseEnter = async () => {
    if (props.video) {
      setIsVideo(true);
      const response = await fetch(`src/assets/${props.video}`);
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      setVideo(blobUrl);
    }
  };

  // Subtle 3D Perspective Tilt on Hover (Direct DOM transform, 0 React re-renders)
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (window.innerWidth <= 1024) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -3.5;
    const rotateY = ((x - centerX) / centerX) * 3.5;

    e.currentTarget.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(
      2
    )}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-5px)`;
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsVideo(false);
    e.currentTarget.style.transform =
      "perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)";
  };

  const changeSlide = (newIdx: number, dir: "next" | "prev") => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setTransitionDir(dir);
    setActiveIdx(newIdx);
    setTimeout(() => {
      setIsTransitioning(false);
    }, 280);
  };

  const handlePrevStep = () => {
    if (!currentGallery || isTransitioning) return;
    const newIdx =
      activeIdx === 0 ? currentGallery.length - 1 : activeIdx - 1;
    changeSlide(newIdx, "prev");
  };

  const handleNextStep = () => {
    if (!currentGallery || isTransitioning) return;
    const newIdx =
      activeIdx === currentGallery.length - 1 ? 0 : activeIdx + 1;
    changeSlide(newIdx, "next");
  };

  const handlePrev = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    handlePrevStep();
  };

  const handleNext = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    handleNextStep();
  };

  const handleDotClick = (e: React.MouseEvent, idx: number) => {
    e.preventDefault();
    e.stopPropagation();
    if (idx === activeIdx || isTransitioning) return;
    changeSlide(idx, idx > activeIdx ? "next" : "prev");
  };

  return (
    <>
      <div
        className={`work-image ${hasGallery ? "has-gallery" : ""} ${
          isDualPortal ? "is-dual-portal" : ""
        }`}
      >
        {/* Dual Portal Tab Switcher */}
        {isDualPortal && (
          <div className="work-portal-switcher">
            {props.portals!.map((p, idx) => (
              <button
                key={p.id}
                type="button"
                className={`portal-tab-btn ${
                  idx === activePortalIdx ? "active" : ""
                }`}
                onClick={() => {
                  if (idx !== activePortalIdx) {
                    setActivePortalIdx(idx);
                  }
                }}
              >
                <span className="portal-tab-dot"></span>
                <span className="portal-tab-label">{p.label}</span>
              </button>
            ))}
          </div>
        )}

        <div
          className="work-image-in"
          onMouseEnter={handleMouseEnter}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          data-cursor={"disable"}
        >
          {/* External Link for single projects */}
          {props.link && !isDualPortal && (
            <a
              href={props.link}
              target="_blank"
              rel="noopener noreferrer"
              className="work-link"
              aria-label="Visit external project"
            >
              <MdArrowOutward />
            </a>
          )}

          {/* Active Portal Header Pill */}
          {isDualPortal && currentPortal && (
            <div className="portal-active-header">
              <span className="portal-active-badge">
                {currentPortal.label}
              </span>
              <a
                href={currentPortal.url}
                target="_blank"
                rel="noopener noreferrer"
                className="portal-active-btn"
                onClick={(e) => e.stopPropagation()}
              >
                <span>{currentPortal.buttonText}</span>
                <MdArrowOutward />
              </a>
            </div>
          )}

          <div
            className={`work-img-clickable ${
              isTransitioning ? `slide-${transitionDir}` : ""
            }`}
            onClick={() => {
              if (!imgLoadError) setIsPreviewOpen(true);
            }}
            title={imgLoadError ? "Screenshot upload pending" : "Click to view full screen"}
          >
            {imgLoadError ? (
              <div className="work-img-awaiting-card">
                <div className="awaiting-icon-wrap">
                  <MdCloudUpload />
                </div>
                <span className="awaiting-tag">SCREENSHOT ASSET READY</span>
                <h5 className="awaiting-screen-name">{currentTitle}</h5>
                <p className="awaiting-desc">
                  Dedicated interface slot mapped for {currentPortal?.label || "portal"}.
                </p>
                {currentPortal && (
                  <a
                    href={currentPortal.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="awaiting-visit-link"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <span>{currentPortal.buttonText}</span>
                    <MdArrowOutward />
                  </a>
                )}
              </div>
            ) : (
              <img
                src={currentImage}
                alt={currentTitle}
                className={`work-main-img ${
                  isTransitioning ? "img-transitioning" : ""
                }`}
                style={{ objectFit: props.imageFit || "contain" }}
                loading="eager"
                decoding="async"
                onError={() => setImgLoadError(true)}
              />
            )}

            {!imgLoadError && (
              <span className="work-zoom-pill">
                <MdFullscreen /> Expand
              </span>
            )}
          </div>

          {isVideo && (
            <video src={video} autoPlay muted playsInline loop></video>
          )}

          {hasGallery && (
            <div className="work-gallery-controls">
              <div className="work-gallery-badge">
                <span className="gallery-step">
                  0{activeIdx + 1} / 0{currentGallery!.length}
                </span>
                <span className="gallery-screen-title">{currentTitle}</span>
              </div>

              <div className="work-gallery-nav">
                <button
                  type="button"
                  className="gallery-nav-btn prev"
                  onClick={handlePrev}
                  aria-label="Previous screen"
                >
                  <MdChevronLeft />
                </button>
                <button
                  type="button"
                  className="gallery-nav-btn next"
                  onClick={handleNext}
                  aria-label="Next screen"
                >
                  <MdChevronRight />
                </button>
              </div>

              <div className="work-gallery-dots">
                {currentGallery!.map((item, idx) => (
                  <button
                    key={idx}
                    type="button"
                    className={`gallery-dot ${
                      idx === activeIdx ? "active" : ""
                    }`}
                    onClick={(e) => handleDotClick(e, idx)}
                    title={item.title}
                    aria-label={`Jump to ${item.title}`}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Lightbox Modal for Inspection & High-Res Reading */}
      {typeof document !== "undefined" &&
        isPreviewOpen &&
        createPortal(
          <div
            className="work-lightbox-overlay"
            onClick={() => setIsPreviewOpen(false)}
          >
            <div
              className="work-lightbox-modal"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="work-lightbox-header">
                <div className="work-lightbox-title-wrap">
                  {currentPortal && (
                    <span className="work-lightbox-portal-badge">
                      {currentPortal.label}
                    </span>
                  )}
                  {hasGallery && (
                    <span className="work-lightbox-step">
                      SCREEN 0{activeIdx + 1} OF 0{currentGallery!.length}
                    </span>
                  )}
                  <h4 className="work-lightbox-title">{currentTitle}</h4>
                </div>
                <button
                  type="button"
                  className="work-lightbox-close"
                  onClick={() => setIsPreviewOpen(false)}
                  aria-label="Close preview"
                >
                  <MdClose />
                </button>
              </div>

              <div className="work-lightbox-body">
                <img
                  src={currentImage}
                  alt={currentTitle}
                  className="work-lightbox-img"
                />

                {hasGallery && currentGallery!.length > 1 && (
                  <>
                    <button
                      type="button"
                      className="work-lightbox-arrow prev"
                      onClick={handlePrev}
                      aria-label="Previous image"
                    >
                      <MdChevronLeft />
                    </button>
                    <button
                      type="button"
                      className="work-lightbox-arrow next"
                      onClick={handleNext}
                      aria-label="Next image"
                    >
                      <MdChevronRight />
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>,
          document.body
        )}
    </>
  );
};

export default WorkImage;
