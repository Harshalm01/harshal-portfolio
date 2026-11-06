import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import {
  MdArrowOutward,
  MdChevronLeft,
  MdChevronRight,
  MdFullscreen,
  MdClose,
} from "react-icons/md";
import { FaAws, FaCheckCircle } from "react-icons/fa";
import "./styles/CreatorInvoiceCaseStudy.css";

export interface InvoiceScreenshot {
  image: string;
  title: string;
  caption?: string;
}

export interface PortalConfig {
  id: "creator" | "admin";
  tabLabel: string;
  portalName: string;
  subTitle: string;
  url: string;
  buttonText: string;
  description: string;
  screenshots: InvoiceScreenshot[];
}

export const creatorScreenshots: InvoiceScreenshot[] = [
  {
    image: "/images/invoices/creator/01-portal-landing-page.png",
    title: "Portal Landing Page",
    caption:
      "Creator onboarding and authentication gateway at invoices.3folks.com.",
  },
  {
    image: "/images/invoices/creator/02-after-login.png",
    title: "After Login (Creator Workspace)",
    caption:
      "Authenticated creator workspace displaying invoice creation tools and profile data.",
  },
  {
    image: "/images/invoices/creator/03-ensures-live-preview.png",
    title: "Real-Time Live Preview Engine",
    caption:
      "Instant dynamic invoice preview — whatever you type gets displayed as live output on the spot.",
  },
  {
    image: "/images/invoices/creator/04-demo-of-live-preview.png",
    title: "Demo of Live Preview",
    caption:
      "Side-by-side interactive document rendering with automatic tax and total computations.",
  },
  {
    image: "/images/invoices/creator/05-e-sign-digitally.png",
    title: "E-Sign Digitally",
    caption:
      "Touch & stylus digital signature canvas and image signature upload interface.",
  },
  {
    image: "/images/invoices/creator/06-final-output-of-invoice.png",
    title: "Final Output of Invoice",
    caption:
      "Verified production PDF output generated and archived to Amazon S3 cloud storage.",
  },
];

export const adminScreenshots: InvoiceScreenshot[] = [
  {
    image: "/images/invoices/admin/01-admin-dashboard.png",
    title: "Admin or Agency Dashboard",
    caption:
      "Comprehensive financial operational console displaying total billing, pending reviews, and creator stats.",
  },
  {
    image: "/images/invoices/admin/02-invoices-display-dashboard.png",
    title: "Invoices Display Dashboard",
    caption:
      "Detailed invoice audit directory with multi-filter sorting, search, verification statuses, and PDF previews.",
  },
  {
    image: "/images/invoices/admin/03-fun-tab.png",
    title: "Fun Tab",
    caption:
      "Gamified internal agency workspace features and interactive team productivity workflows.",
  },
  {
    image: "/images/invoices/admin/04-paper-3d-view.png",
    title: "Paper 3D View",
    caption:
      "Interactive 3D paper tilt simulation with audit trail inspection and Accounts Authorization station with rubber stamps.",
  },
];

const portals: PortalConfig[] = [
  {
    id: "creator",
    tabLabel: "CREATOR PORTAL",
    portalName: "Creator Experience",
    subTitle: "Self-service invoicing, document signing & tracking interface",
    url: "https://invoices.3folks.com",
    buttonText: "VISIT CREATOR PORTAL",
    description:
      "Dedicated creator-facing interface designed to submit campaign-linked invoices, attach digital signatures, track payment approval stages, and download verified PDFs.",
    screenshots: creatorScreenshots,
  },
  {
    id: "admin",
    tabLabel: "ADMIN / AGENCY PORTAL",
    portalName: "Agency Management Experience",
    subTitle: "Internal operations, campaign control & finance approval workflows",
    url: "https://invoices.3folks.com/admin",
    buttonText: "VISIT ADMIN PORTAL",
    description:
      "Internal agency management console engineered for finance teams to configure campaigns, manage creator agreements, inspect generated PDFs, and orchestrate invoice approval workflows.",
    screenshots: adminScreenshots,
  },
];

const coreCapabilities = [
  "Role-Based Access Control (RBAC)",
  "Creator and user management",
  "Campaign management",
  "Campaign-linked invoice submissions",
  "Invoice generation and PDF handling",
  "Digital signatures (draw or upload)",
  "Invoice review, edit, approve & reject workflows",
  "AWS S3 invoice document storage",
  "SQLite and PostgreSQL database support",
  "Email & in-app notifications",
  "Real-time events with Socket.IO",
];

const techGroups = [
  {
    category: "Cloud Infrastructure",
    isAws: true,
    items: ["AWS", "Amazon S3", "AWS SDK for JavaScript v3"],
  },
  {
    category: "Backend & Application",
    items: ["Node.js", "Express.js", "TypeScript", "JavaScript", "Python"],
  },
  {
    category: "Frontend & Templates",
    items: ["EJS", "CSS3", "HTML5"],
  },
  {
    category: "Databases",
    items: ["SQLite", "PostgreSQL"],
  },
  {
    category: "Libraries & Tools",
    items: ["Socket.IO", "PDFKit", "Multer", "Nodemailer", "bcryptjs"],
  },
];

const CreatorInvoiceCaseStudy = () => {
  const [activePortalIdx, setActivePortalIdx] = useState(0);
  const [activeSlideIdx, setActiveSlideIdx] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [transitionDir, setTransitionDir] = useState<"next" | "prev">("next");
  const [imageErrorMap, setImageErrorMap] = useState<Record<string, boolean>>({});

  const currentPortal = portals[activePortalIdx];
  const currentScreenshots = currentPortal.screenshots;
  const currentScreen = currentScreenshots[activeSlideIdx] || currentScreenshots[0];

  const currentImgKey = `${currentPortal.id}-${activeSlideIdx}`;
  const isCurrentImgMissing = Boolean(imageErrorMap[currentImgKey]);

  // Reset slide index when switching portal tabs
  const handleTabChange = (idx: number) => {
    if (idx === activePortalIdx) return;
    setActivePortalIdx(idx);
    setActiveSlideIdx(0);
  };

  // Carousel navigation
  const changeSlide = (newIdx: number, dir: "next" | "prev") => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setTransitionDir(dir);
    setActiveSlideIdx(newIdx);
    setTimeout(() => {
      setIsTransitioning(false);
    }, 240);
  };

  const handlePrev = () => {
    const nextIdx =
      activeSlideIdx === 0
        ? currentScreenshots.length - 1
        : activeSlideIdx - 1;
    changeSlide(nextIdx, "prev");
  };

  const handleNext = () => {
    const nextIdx =
      activeSlideIdx === currentScreenshots.length - 1
        ? 0
        : activeSlideIdx + 1;
    changeSlide(nextIdx, "next");
  };

  // Keyboard navigation for Lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isLightboxOpen) return;
      if (e.key === "Escape") setIsLightboxOpen(false);
      if (e.key === "ArrowLeft") handlePrev();
      if (e.key === "ArrowRight") handleNext();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isLightboxOpen, activeSlideIdx, currentScreenshots.length]);

  return (
    <article
      id="proj-accounts"
      className="invoice-case-study work-card"
    >
      {/* ==========================================================
          SECTION A — PROJECT INTRODUCTION
          ========================================================== */}
      <header className="case-study-header">
        <div className="case-study-meta-row">
          <span className="case-study-num">// 01</span>
          <span className="case-study-company">3Folks Media</span>
          <span className="case-study-role">· Software Developer</span>
          <span className="case-study-tag">
            Full-Stack Web Application | Cloud Infrastructure
          </span>
        </div>

        <h3 className="case-study-title">Creator Invoice Management Portal</h3>

        <p className="case-study-desc">
          A full-stack invoice management platform engineered for 3Folks Media
          to streamline creator billing, campaign-linked submissions, automated
          PDF generation, and internal financial approval workflows across two
          connected portals.
        </p>
      </header>

      {/* ==========================================================
          SECTION B — AWS CLOUD INFRASTRUCTURE (PROMINENT PANEL)
          ========================================================== */}
      <section className="case-study-aws-panel">
        <div className="aws-panel-header">
          <div className="aws-panel-brand">
            <div className="aws-panel-icon-wrap">
              <FaAws className="aws-icon" />
            </div>
            <div>
              <span className="aws-panel-sub-label">
                CLOUD INFRASTRUCTURE — POWERED BY AWS
              </span>
              <h4 className="aws-panel-main-highlight">
                Amazon S3 — Invoice Document Storage
              </h4>
            </div>
          </div>
          <span className="aws-panel-pill">AWS S3 BUCKET ACTIVE</span>
        </div>

        <ul className="aws-panel-bullets">
          <li>
            <span className="aws-bullet-dot">▸</span>
            <span>Invoice document storage using Amazon S3.</span>
          </li>
          <li>
            <span className="aws-bullet-dot">▸</span>
            <span>File uploads through AWS SDK for JavaScript v3.</span>
          </li>
          <li>
            <span className="aws-bullet-dot">▸</span>
            <span>S3 object operations for document management.</span>
          </li>
          <li>
            <span className="aws-bullet-dot">▸</span>
            <span>Cloud storage integration within the invoice workflow.</span>
          </li>
        </ul>
      </section>

      {/* ==========================================================
          SECTION C — TWO PORTAL EXPERIENCES (HORIZONTAL SELECTOR TABS)
          ========================================================== */}
      <section className="case-study-portals-section">
        <div className="case-study-tabs-wrap">
          {portals.map((p, idx) => (
            <button
              key={p.id}
              type="button"
              className={`case-study-tab ${
                idx === activePortalIdx ? "is-active" : ""
              }`}
              onClick={() => handleTabChange(idx)}
            >
              <span className="tab-status-dot" />
              <span className="tab-title">{p.tabLabel}</span>
            </button>
          ))}
        </div>

        {/* Selected Portal Summary Bar */}
        <div className="portal-summary-bar">
          <div className="portal-summary-text">
            <span className="portal-summary-badge">{currentPortal.portalName}</span>
            <span className="portal-summary-desc">{currentPortal.subTitle}</span>
          </div>
          <a
            href={currentPortal.url}
            target="_blank"
            rel="noopener noreferrer"
            className="portal-visit-btn"
          >
            <span>{currentPortal.buttonText}</span>
            <MdArrowOutward />
          </a>
        </div>

        {/* ==========================================================
            SECTION D — LARGE SCREENSHOT GALLERY
            ========================================================== */}
        <div className="case-study-gallery-wrap">
          <div className="gallery-display-stage">
            {isCurrentImgMissing ? (
              /* Small, elegant temporary empty state as requested */
              <div className="gallery-empty-state">
                <div className="empty-state-info">
                  <span className="empty-state-pulse" />
                  <span className="empty-state-text">
                    <strong>{currentScreen.title}</strong> — Screenshot slot
                    ready.
                  </span>
                </div>
                <a
                  href={currentPortal.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="empty-state-btn"
                >
                  <span>Test on {currentPortal.url.replace("https://", "")}</span>
                  <MdArrowOutward />
                </a>
              </div>
            ) : (
              <div
                className={`gallery-img-container ${
                  isTransitioning ? `slide-${transitionDir}` : ""
                }`}
                onClick={() => setIsLightboxOpen(true)}
                title="Click to inspect full resolution"
              >
                <img
                  src={currentScreen.image}
                  alt={currentScreen.title}
                  className={`gallery-screen-img ${
                    isTransitioning ? "is-fading" : ""
                  }`}
                  onError={() =>
                    setImageErrorMap((prev) => ({
                      ...prev,
                      [currentImgKey]: true,
                    }))
                  }
                  loading="lazy"
                />
                <button
                  type="button"
                  className="gallery-expand-pill"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsLightboxOpen(true);
                  }}
                >
                  <MdFullscreen /> Expand High-Res
                </button>
              </div>
            )}

            {/* Carousel Previous / Next Arrows */}
            <button
              type="button"
              className="gallery-nav-arrow prev"
              onClick={handlePrev}
              aria-label="Previous screenshot"
            >
              <MdChevronLeft />
            </button>
            <button
              type="button"
              className="gallery-nav-arrow next"
              onClick={handleNext}
              aria-label="Next screenshot"
            >
              <MdChevronRight />
            </button>
          </div>

          {/* Gallery Footer & Dots */}
          <div className="gallery-footer-bar">
            <div className="gallery-meta">
              <span className="gallery-index">
                0{activeSlideIdx + 1} / 0{currentScreenshots.length}
              </span>
              <span className="gallery-screen-title">{currentScreen.title}</span>
              {currentScreen.caption && (
                <span className="gallery-caption">
                  — {currentScreen.caption}
                </span>
              )}
            </div>

            <div className="gallery-dots-row">
              {currentScreenshots.map((screen, idx) => (
                <button
                  key={idx}
                  type="button"
                  className={`gallery-dot ${
                    idx === activeSlideIdx ? "is-active" : ""
                  }`}
                  onClick={() =>
                    changeSlide(idx, idx > activeSlideIdx ? "next" : "prev")
                  }
                  title={screen.title}
                  aria-label={`Jump to ${screen.title}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ==========================================================
          SECTION E — TECHNOLOGIES AND FEATURES (COMPACT & ORGANIZED)
          ========================================================== */}
      <footer className="case-study-footer-details">
        {/* Core Capabilities */}
        <div className="compact-capabilities-block">
          <span className="details-mini-label">CORE PLATFORM CAPABILITIES</span>
          <div className="capabilities-compact-grid">
            {coreCapabilities.map((cap, i) => (
              <div key={i} className="capability-chip">
                <FaCheckCircle className="cap-icon" />
                <span>{cap}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Technology Architecture Groups */}
        <div className="compact-tech-block">
          <span className="details-mini-label">VERIFIED TECHNOLOGY STACK</span>
          <div className="tech-groups-column">
            {techGroups.map((group, i) => (
              <div
                key={i}
                className={`tech-group-item ${
                  group.isAws ? "is-aws-highlight" : ""
                }`}
              >
                <span className="tech-group-name">
                  {group.isAws && <FaAws className="tech-aws-icon" />}
                  {group.category}:
                </span>
                <div className="tech-chips-wrap">
                  {group.items.map((tech, j) => (
                    <span
                      key={j}
                      className={`tech-pill ${
                        group.isAws ? "aws-pill" : ""
                      }`}
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </footer>

      {/* Fullscreen Lightbox Modal */}
      {typeof document !== "undefined" &&
        isLightboxOpen &&
        createPortal(
          <div
            className="case-study-lightbox-overlay"
            onClick={() => setIsLightboxOpen(false)}
          >
            <div
              className="case-study-lightbox-window"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="lightbox-top-bar">
                <div>
                  <span className="lightbox-portal-tag">
                    {currentPortal.tabLabel}
                  </span>
                  <h4 className="lightbox-title">
                    0{activeSlideIdx + 1} // {currentScreen.title}
                  </h4>
                </div>
                <button
                  type="button"
                  className="lightbox-close-btn"
                  onClick={() => setIsLightboxOpen(false)}
                  aria-label="Close modal"
                >
                  <MdClose />
                </button>
              </div>

              <div className="lightbox-content">
                <img
                  src={currentScreen.image}
                  alt={currentScreen.title}
                  className="lightbox-img"
                />

                <button
                  type="button"
                  className="lightbox-arrow prev"
                  onClick={handlePrev}
                  aria-label="Previous"
                >
                  <MdChevronLeft />
                </button>
                <button
                  type="button"
                  className="lightbox-arrow next"
                  onClick={handleNext}
                  aria-label="Next"
                >
                  <MdChevronRight />
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}
    </article>
  );
};

export default CreatorInvoiceCaseStudy;

