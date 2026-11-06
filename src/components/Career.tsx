import { useState, useRef, useEffect, useMemo, useCallback } from "react";
import { createPortal } from "react-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollSmoother } from "gsap/ScrollSmoother";
import ScrollIndicator from "./ScrollIndicator";

gsap.registerPlugin(ScrollTrigger);
import {
  TbRadar,
  TbTerminal2,
  TbShieldCheck,
  TbGitBranch,
  TbCheck,
  TbX,
  TbCpu,
  TbDatabase,
  TbSparkles,
  TbChevronRight,
  TbCertificate,
  TbExternalLink,
  TbDownload,
  TbZoomIn,
  TbZoomOut,
  TbSchool,
  TbAward,
  TbFileText,
  TbMaximize,
  TbMinimize,
} from "react-icons/tb";

import {
  educationMilestones,
  experienceMissions,
  skillBranches,
  calculateUniverseStats,
  Certificate,
  EducationMilestone,
  MissionExperience,
  SkillNode,
} from "./careerData";

import "./styles/Career.css";

/* ==========================================================
   LIGHTWEIGHT ANIMATED SVG CONSTELLATION GRAPHIC
   (Zero WebGL/Three.js overhead, 100% 60FPS fluid SVG)
   ========================================================== */
const ConstellationBackground = () => (
  <div className="career-constellation-bg" aria-hidden="true">
    <svg
      className="constellation-svg"
      viewBox="0 0 1200 600"
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <radialGradient id="starGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#c2a4ff" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#c2a4ff" stopOpacity="0" />
        </radialGradient>
        <linearGradient
          id="constellationLine"
          x1="0%"
          y1="0%"
          x2="100%"
          y2="100%"
        >
          <stop offset="0%" stopColor="rgba(194, 164, 255, 0.05)" />
          <stop offset="50%" stopColor="rgba(194, 164, 255, 0.28)" />
          <stop offset="100%" stopColor="rgba(194, 164, 255, 0.05)" />
        </linearGradient>
      </defs>

      {/* Connected Constellation Paths */}
      <polyline
        points="100,70 250,170 430,110 570,210 750,130 910,230 1090,150"
        stroke="url(#constellationLine)"
        strokeWidth="1.2"
        strokeDasharray="4 6"
        className="constellation-path p1"
      />
      <polyline
        points="250,170 330,310 510,370 670,300 850,410 910,230"
        stroke="url(#constellationLine)"
        strokeWidth="1"
        strokeDasharray="3 5"
        className="constellation-path p2"
      />
      <polyline
        points="430,110 510,370 750,130"
        stroke="url(#constellationLine)"
        strokeWidth="0.8"
        strokeDasharray="2 4"
        className="constellation-path p3"
      />

      {/* Nodes & Shimmering Stars */}
      {[
        { cx: 100, cy: 70, r: 2.5, delay: "0s" },
        { cx: 250, cy: 170, r: 3.5, delay: "1.2s", pulse: true },
        { cx: 430, cy: 110, r: 2.8, delay: "2.4s" },
        { cx: 570, cy: 210, r: 4, delay: "0.8s", pulse: true },
        { cx: 750, cy: 130, r: 3, delay: "1.8s" },
        { cx: 910, cy: 230, r: 4.5, delay: "0.4s", pulse: true },
        { cx: 1090, cy: 150, r: 2.5, delay: "2.1s" },
        { cx: 330, cy: 310, r: 3, delay: "1.5s" },
        { cx: 510, cy: 370, r: 4.2, delay: "2.8s", pulse: true },
        { cx: 670, cy: 300, r: 3, delay: "0.6s" },
        { cx: 850, cy: 410, r: 3.2, delay: "1.9s" },
      ].map((star, idx) => (
        <g key={idx} style={{ animationDelay: star.delay }}>
          {star.pulse && (
            <circle
              cx={star.cx}
              cy={star.cy}
              r={star.r * 2.8}
              fill="url(#starGlow)"
              className="constellation-star-glow"
            />
          )}
          <circle
            cx={star.cx}
            cy={star.cy}
            r={star.r}
            fill="#c2a4ff"
            className="constellation-star-dot"
          />
        </g>
      ))}
    </svg>
  </div>
);

const Career = () => {
  // Modal selection states
  const [selectedMission, setSelectedMission] = useState<MissionExperience | null>(null);
  const [selectedMilestone, setSelectedMilestone] = useState<EducationMilestone | null>(null);
  const [activeCertificate, setActiveCertificate] = useState<Certificate | null>(null);
  const [isZoomed, setIsZoomed] = useState<boolean>(false);
  const [isCertFullscreen, setIsCertFullscreen] = useState<boolean>(true);

  // Skill matrix states
  const [activeBranchId, setActiveBranchId] = useState<string>("frontend");
  const [displayedBranchId, setDisplayedBranchId] = useState<string>("frontend");
  const [hoveredNode, setHoveredNode] = useState<SkillNode | null>(null);
  const [isCardsExiting, setIsCardsExiting] = useState(false);
  const [isSkillMatrixVisible, setIsSkillMatrixVisible] = useState(false);
  const skillMatrixRef = useRef<HTMLDivElement>(null);
  const careerSectionRef = useRef<HTMLDivElement>(null);

  // Advanced Scroll-Driven Timeline & Card Reveal (100% reversible scrubbing)
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReducedMotion || !careerSectionRef.current) return;

    const ctx = gsap.context(() => {
      // 1. Career section hero deck reveal (triggers early, completes quickly)
      gsap.from(".universe-hero-deck", {
        scrollTrigger: {
          trigger: ".universe-hero-deck",
          start: "top 95%",
          end: "top 78%",
          scrub: true,
        },
        opacity: 0,
        y: 20,
        ease: "none",
      });

      // 2. Academic Milestones progressive reveal
      const milestones = gsap.utils.toArray<HTMLElement>(
        ".universe-milestone-node"
      );
      milestones.forEach((node) => {
        gsap.from(node, {
          scrollTrigger: {
            trigger: node,
            start: "top 95%",
            end: "top 76%",
            scrub: true,
          },
          opacity: 0,
          y: 25,
          scale: 0.98,
          ease: "none",
        });
      });

      // 3. Central Timeline Line drawing synchronized with scroll progress
      gsap.fromTo(
        ".career-timeline",
        { scaleY: 0, transformOrigin: "top center" },
        {
          scaleY: 1,
          ease: "none",
          scrollTrigger: {
            trigger: ".rpg-missions-track",
            start: "top 85%",
            end: "bottom 80%",
            scrub: true,
          },
        }
      );

      // 4. Alternating Deployed Mission Cards progressive reveal (minimal scroll distance)
      const missionCards = gsap.utils.toArray<HTMLElement>(
        ".universe-mission-card"
      );
      missionCards.forEach((card, idx) => {
        const isEven = idx % 2 === 0;
        const leftSide = card.querySelector(".rpg-mission-side.left");
        const rightSide = card.querySelector(".rpg-mission-side.right");
        const dot = card.querySelector(".rpg-node-dot");

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: card,
            start: "top 95%",
            end: "top 72%",
            scrub: true,
          },
          defaults: { ease: "none" },
        });

        // Alternating entry: even cards enter from left, odd cards enter from right
        tl.fromTo(
          card,
          {
            opacity: 0,
            x: isEven ? -25 : 25,
            scale: 0.98,
          },
          {
            opacity: 1,
            x: 0,
            scale: 1,
            duration: 0.45,
          },
          0
        );

        if (leftSide) {
          tl.fromTo(
            leftSide,
            { x: isEven ? -18 : -10, opacity: 0.4 },
            { x: 0, opacity: 1, duration: 0.35 },
            0.05
          );
        }

        if (rightSide) {
          tl.fromTo(
            rightSide,
            { x: isEven ? 10 : 18, opacity: 0.4 },
            { x: 0, opacity: 1, duration: 0.35 },
            0.05
          );
        }

        if (dot) {
          tl.fromTo(
            dot,
            { scale: 0, opacity: 0 },
            { scale: 1, opacity: 1, duration: 0.3 },
            0.08
          );
        }
      });
    }, careerSectionRef);

    return () => ctx.revert();
  }, []);

  // Dynamically calculate statistics from actual data arrays (zero hardcoded counts)
  const stats = useMemo(
    () => calculateUniverseStats(educationMilestones, experienceMissions),
    []
  );

  // IntersectionObserver for Skill Matrix reveal
  useEffect(() => {
    const el = skillMatrixRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsSkillMatrixVisible(true);
            observer.unobserve(el);
          }
        });
      },
      { threshold: 0.15 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Unified modal closer that guarantees scroll restoration and ScrollSmoother unpause
  const closeAllModals = useCallback(() => {
    setActiveCertificate(null);
    setSelectedMission(null);
    setSelectedMilestone(null);
    setIsZoomed(false);
    document.body.style.overflow = "";
    document.body.style.overflowY = "auto";
    const s = ScrollSmoother.get();
    if (s) {
      s.paused(false);
    }
  }, []);

  // Keyboard accessibility: Escape key closes active modals
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeAllModals();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [closeAllModals]);

  // Lock background scroll when any modal is open and restore when closed
  useEffect(() => {
    const isAnyModalOpen =
      !!selectedMission || !!selectedMilestone || !!activeCertificate;
    const smootherInstance = ScrollSmoother.get();

    if (isAnyModalOpen) {
      document.body.style.overflow = "hidden";
      if (smootherInstance) {
        smootherInstance.paused(true);
      }
    } else {
      document.body.style.overflow = "";
      document.body.style.overflowY = "auto";
      if (smootherInstance) {
        smootherInstance.paused(false);
      }
    }

    return () => {
      document.body.style.overflow = "";
      document.body.style.overflowY = "auto";
      const s = ScrollSmoother.get();
      if (s) {
        s.paused(false);
      }
    };
  }, [selectedMission, selectedMilestone, activeCertificate]);

  // Skill branch selection
  const handleBranchSelect = (branchId: string) => {
    if (branchId === activeBranchId || isCardsExiting) return;
    setActiveBranchId(branchId);
    setIsCardsExiting(true);
    setTimeout(() => {
      setDisplayedBranchId(branchId);
      setIsCardsExiting(false);
    }, 180);
  };

  const activeBranch =
    skillBranches.find((b) => b.id === displayedBranchId) || skillBranches[0];

  const getBranchIcon = (id: string) => {
    switch (id) {
      case "frontend":
        return TbSparkles;
      case "backend":
        return TbTerminal2;
      case "database":
        return TbDatabase;
      case "cloud":
        return TbRadar;
      case "design":
        return TbGitBranch;
      default:
        return TbCpu;
    }
  };

  return (
    <div
      className="career-section section-container"
      id="career"
      ref={careerSectionRef}
    >
      <div className="career-container">
        {/* Subtle Background Constellation Graphic */}
        <ConstellationBackground />

        {/* ==========================================================
            01. CAREER UNIVERSE INTRODUCTION & DYNAMIC METRICS
            ========================================================== */}
        <div className="universe-hero-deck">
          <div className="universe-tag-chip">
            <span className="universe-beacon-dot"></span>
            <code>CAREER UNIVERSE / 01</code>
          </div>

          <h2 className="universe-headline">
            My Journey <span>Beyond Code.</span>
          </h2>

          <p className="universe-subtext">
            Every experience, every challenge and every milestone has shaped the
            developer I am becoming.
          </p>

          {/* Dynamic Statistics Display (Calculated from Data Arrays) */}
          <div className="universe-stats-row">
            <div className="universe-stat-card">
              <div className="universe-stat-num">
                0{stats.totalEducation}
                <span className="stat-unit">MILESTONES</span>
              </div>
              <div className="universe-stat-meta">
                <TbSchool className="stat-icon" />
                <span>Academic Foundations</span>
              </div>
            </div>

            <div className="universe-stat-card">
              <div className="universe-stat-num">
                0{stats.totalMissions}
                <span className="stat-unit">MISSIONS</span>
              </div>
              <div className="universe-stat-meta">
                <TbAward className="stat-icon" />
                <span>Industry Deployments</span>
              </div>
            </div>

            <div className="universe-stat-card">
              <div className="universe-stat-num">
                0{stats.totalCertificates}
                <span className="stat-unit">CREDENTIALS</span>
              </div>
              <div className="universe-stat-meta">
                <TbCertificate className="stat-icon" />
                <span>Verified Certificates</span>
              </div>
            </div>
          </div>
        </div>

        {/* ==========================================================
            02. EDUCATION CONSTELLATION (CONNECTED PROGRESSION NODES)
            ========================================================== */}
        <div className="universe-block">
          <div className="universe-block-label">
            <span className="universe-label-num">01</span>
            <h4>EDUCATION CONSTELLATION</h4>
            <span className="universe-label-line"></span>
          </div>

          <div className="universe-constellation-track">
            {/* SVG Connecting Progression Path */}
            <div className="universe-path-line-wrap" aria-hidden="true">
              <div className="universe-path-line"></div>
              <div className="universe-path-glow-sweep"></div>
            </div>

            <div className="universe-milestones-grid">
              {educationMilestones.map((m) => {
                const isCompleted = m.status === "COMPLETED";
                return (
                  <div
                    key={m.id}
                    className={`universe-milestone-node ${
                      isCompleted ? "completed" : "active-pursuit"
                    }`}
                    onClick={() => setSelectedMilestone(m)}
                  >
                    <div className="universe-milestone-top">
                      <div className="universe-milestone-tag">
                        <span className="node-level">{m.level}</span>
                        <span className="node-sep">//</span>
                        <span className="node-tier">{m.tier}</span>
                      </div>

                      <span
                        className={`universe-status-badge ${
                          isCompleted ? "status-done" : "status-active"
                        }`}
                      >
                        {isCompleted ? (
                          <>
                            <TbCheck className="badge-icon" /> MILESTONE ACHIEVED
                          </>
                        ) : (
                          <>
                            <span className="status-pulse-ring"></span>
                            MILESTONE TO BE ACHIEVED
                          </>
                        )}
                      </span>
                    </div>

                    <h3 className="universe-milestone-title">{m.qualification}</h3>
                    <p className="universe-milestone-inst">{m.institution}</p>

                    <div className="universe-milestone-foot">
                      <span className="universe-period-badge">{m.period}</span>
                      <span className="universe-action-link">
                        Inspect Milestone <TbChevronRight />
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* ==========================================================
            03. PROFESSIONAL MISSION ARCHIVE
            ========================================================== */}
        <div className="universe-block">
          <div className="universe-block-label">
            <span className="universe-label-num">02</span>
            <h4>DEPLOYED MISSIONS</h4>
            <span className="universe-label-line"></span>
          </div>

          <div className="universe-section-intro">
            <h3 className="universe-subhead">Experience That Built Me.</h3>
            <p className="universe-intro-desc">
              Chronological mission logs highlighting data science engineering,
              UI/UX design systems, and operations management.
            </p>
          </div>

          <div className="rpg-missions-track">
            {/* Kept .career-timeline and .career-dot for GSAP ScrollTrigger compatibility */}
            <div className="career-timeline">
              <div className="career-dot"></div>
            </div>

            <div className="rpg-missions-list">
              {experienceMissions.map((mission) => (
                <div
                  key={mission.id}
                  className="career-info-box universe-mission-card"
                  onClick={() => setSelectedMission(mission)}
                >
                  <div className="rpg-mission-side left">
                    <div className="universe-mission-code-badge">
                      <span>{mission.missionNumber}</span>
                      {mission.track && (
                        <span className="universe-track-tag">
                          {mission.track.split("—")[0].trim()}
                        </span>
                      )}
                      {mission.workMode && (
                        <span className="universe-mode-tag">
                          {mission.workMode}
                        </span>
                      )}
                    </div>
                    <h3 className="rpg-node-title">{mission.title}</h3>
                    <h5 className="rpg-node-org">
                      {mission.organization}
                      {mission.role && ` · ${mission.role}`}
                    </h5>
                  </div>

                  <div className="rpg-node-connector">
                    <div className="rpg-node-dot">
                      <span className="rpg-node-ring"></span>
                    </div>
                  </div>

                  <div className="rpg-mission-side right">
                    <div className="rpg-date-badge">{mission.period}</div>
                    <p className="rpg-node-desc">{mission.description}</p>
                    <div className="rpg-node-tags">
                      {mission.skills.slice(0, 3).map((s, i) => (
                        <span key={i} className="rpg-skill-chip">
                          {s}
                        </span>
                      ))}
                      <span className="rpg-inspect-link">
                        Briefing & Credential <TbChevronRight />
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ==========================================================
            04. TACTICAL SKILL MATRIX (PRESERVED & FULLY POPULATED)
            ========================================================== */}
        <div
          ref={skillMatrixRef}
          className={`rpg-block rpg-block-skills ${
            isSkillMatrixVisible ? "entered" : ""
          }`}
        >
          <div className="rpg-block-label-wrap">
            <div className="universe-block-label">
              <span className="universe-label-num">03</span>
              <h4>TACTICAL SKILL MATRIX</h4>
              <span className="universe-label-line"></span>
            </div>
            {/* Animated Left-to-Right Divider with Purple Light Sweep */}
            <div className="rpg-divider-track">
              <div className="rpg-divider-line"></div>
              <div className="rpg-divider-sweep"></div>
            </div>
          </div>

          <div className="rpg-skilltree-panel">
            {/* Category Navigation Tabs */}
            <div className="rpg-branches-nav">
              {skillBranches.map((branch, index) => {
                const Icon = getBranchIcon(branch.id);
                const isActive = branch.id === activeBranchId;
                return (
                  <button
                    key={branch.id}
                    className={`rpg-branch-btn ${isActive ? "active" : ""}`}
                    onClick={() => handleBranchSelect(branch.id)}
                    style={{ "--tab-index": index } as React.CSSProperties}
                  >
                    <Icon className="rpg-branch-icon" />
                    <span>{branch.name}</span>
                    {isActive && <span className="rpg-btn-glow"></span>}
                  </button>
                );
              })}
            </div>

            {/* Active Branch Matrix Display */}
            <div className="rpg-tree-content">
              <div className="rpg-tree-header">
                <div>
                  <span className="rpg-tree-code">
                    BRANCH_NODE // {activeBranch.id.toUpperCase()}
                  </span>
                  <h3 className="rpg-tree-title">{activeBranch.name}</h3>
                </div>
                <span className="rpg-tree-focus">{activeBranch.focus}</span>
              </div>

              {/* Staggered Animated Skill Cards (Zero Empty Void) */}
              <div
                className={`rpg-nodes-grid ${
                  isCardsExiting ? "cards-exiting" : "cards-entering"
                }`}
                key={displayedBranchId}
              >
                {activeBranch.nodes.map((node, i) => (
                  <div
                    key={node.name}
                    className="rpg-tree-node"
                    style={{ "--node-index": i } as React.CSSProperties}
                    onMouseEnter={() => setHoveredNode(node)}
                    onMouseLeave={() => setHoveredNode(null)}
                  >
                    <div className="rpg-tree-node-top">
                      <div className="rpg-node-level-wrap">
                        <TbShieldCheck className="rpg-node-check-icon" />
                        <span className="rpg-node-badge">{node.level}</span>
                      </div>
                      <span className="rpg-node-status-pill">VERIFIED</span>
                    </div>

                    <h5 className="rpg-node-name">{node.name}</h5>

                    <div className="rpg-node-bar">
                      <div className="rpg-node-progress"></div>
                    </div>

                    <div className="rpg-node-applied">
                      <span className="rpg-applied-prefix">APPLIED:</span>
                      <span className="rpg-applied-project">{node.appliedIn}</span>
                    </div>

                    <div className="rpg-node-tags">
                      {node.tags.map((tag, tIdx) => (
                        <span key={tIdx} className="rpg-node-tag-item">
                          {tag}
                        </span>
                      ))}
                    </div>

                    <div className="rpg-node-foot">
                      <span className="rpg-node-status">100% OPERATIONAL</span>
                      <span className="rpg-node-status-code">SYS//VERIFIED</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Option 3: Interactive Panel Footer HUD Telemetry Bar */}
            <div className="rpg-matrix-footer">
              <div className="rpg-matrix-feed">
                <div className="rpg-feed-status">
                  <span
                    className={`rpg-feed-beacon ${
                      hoveredNode ? "pulse" : ""
                    }`}
                  ></span>
                  <span className="rpg-feed-channel">
                    {hoveredNode
                      ? `LIVE STREAM // ${hoveredNode.name.toUpperCase()}`
                      : "TELEMETRY FEED // GLOBAL OVERVIEW"}
                  </span>
                </div>
                <div className="rpg-feed-text">
                  <code>
                    &gt;{" "}
                    {hoveredNode
                      ? hoveredNode.telemetry
                      : `SYS_CORE // V2.6_ACTIVE // DOMAIN: ${activeBranch.name.toUpperCase()} // 100% STABILITY`}
                  </code>
                </div>
              </div>

              <div className="rpg-matrix-stats">
                <div className="rpg-footer-item">
                  <span className="rpg-footer-dot"></span>
                  <span className="rpg-footer-label">DOMAINS:</span>
                  <span className="rpg-footer-val">5 / 5 OPERATIONAL</span>
                </div>
                <div className="rpg-footer-item">
                  <span className="rpg-footer-label">HEALTH:</span>
                  <span className="rpg-footer-val green">100% VERIFIED</span>
                </div>
                <div className="rpg-footer-item">
                  <span className="rpg-footer-label">ARCHITECTURE:</span>
                  <span className="rpg-footer-val">FULL-STACK & UI/UX</span>
                </div>
                <div className="rpg-footer-item telemetry-code">
                  <code>HARSHAL_MEHTA // PORTFOLIO_V2.6</code>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ==========================================================
            05. HOLOGRAPHIC MISSION BRIEFING MODAL (PORTAL)
            ========================================================== */}
        {typeof document !== "undefined" &&
          selectedMission &&
          createPortal(
            <div
              className="rpg-modal-overlay"
              onClick={closeAllModals}
            >
              <div
                className="rpg-modal-window"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="rpg-modal-header">
                  <div>
                    <div className="rpg-modal-header-chips">
                      <span className="rpg-hud-chip mini">
                        {missionCode(selectedMission)} // MISSION BRIEFING
                      </span>
                      {selectedMission.track && (
                        <span className="rpg-track-badge">
                          {selectedMission.track}
                        </span>
                      )}
                    </div>
                    <h3 className="rpg-modal-title">
                      {selectedMission.title} · {selectedMission.organization}
                    </h3>
                  </div>
                  <button
                    className="rpg-close-btn"
                    onClick={closeAllModals}
                    aria-label="Close modal"
                  >
                    <TbX />
                  </button>
                </div>

                <div className="rpg-modal-body">
                  <div className="rpg-modal-meta">
                    {selectedMission.role && (
                      <div>
                        <span className="rpg-meta-t">ROLE ASSIGNED</span>
                        <span className="rpg-meta-d">{selectedMission.role}</span>
                      </div>
                    )}
                    <div>
                      <span className="rpg-meta-t">TIMEFRAME</span>
                      <span className="rpg-meta-d">{selectedMission.period}</span>
                    </div>
                    {selectedMission.workMode && (
                      <div>
                        <span className="rpg-meta-t">WORK MODE</span>
                        <span className="rpg-meta-d">{selectedMission.workMode}</span>
                      </div>
                    )}
                    <div>
                      <span className="rpg-meta-t">MISSION STATUS</span>
                      <span className="rpg-meta-d status-ok">
                        <TbCheck /> {selectedMission.status}
                      </span>
                    </div>
                  </div>

                  <div className="rpg-modal-section">
                    <h5>MISSION SUMMARY</h5>
                    <p>{selectedMission.description}</p>
                  </div>

                  <div className="rpg-modal-section">
                    <h5>KEY FOCUS AREAS & DIRECTIVES</h5>
                    <ul className="rpg-directives-list">
                      {selectedMission.directives.map((dir, i) => (
                        <li key={i}>{dir}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="rpg-modal-section">
                    <h5>VERIFIED TOOLSET</h5>
                    <div className="rpg-tools-flex">
                      {selectedMission.skills.map((s, i) => (
                        <span key={i} className="rpg-tool-badge">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Dedicated Project Showcase (Jayco Mobile App & 3Folks Invoicing Portal) */}
                  {selectedMission.project && (
                    <div className="rpg-modal-section rpg-project-showcase-section">
                      <div className="rpg-project-section-title">
                        <h5>FEATURED PROJECT SHOWCASE</h5>
                        {selectedMission.project.category && (
                          <span className="rpg-project-cat-badge">
                            {selectedMission.project.category}
                          </span>
                        )}
                      </div>

                      <div className="rpg-project-card">
                        <div className="rpg-project-header">
                          <div className="rpg-project-identity">
                            <h4 className="rpg-project-name">
                              {selectedMission.project.title}
                            </h4>
                          </div>

                          <div className="rpg-project-actions">
                            {selectedMission.project.repoUrl && (
                              <a
                                href={selectedMission.project.repoUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="rpg-view-project-btn"
                              >
                                <span>VIEW PROJECT</span>
                                <TbExternalLink />
                              </a>
                            )}

                            {selectedMission.project.liveLinks &&
                              selectedMission.project.liveLinks.map(
                                (link, idx) => (
                                  <a
                                    key={idx}
                                    href={link.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={`rpg-view-project-btn ${
                                      idx === 0 ? "live-btn" : "admin-btn"
                                    }`}
                                    title={link.description || link.label}
                                  >
                                    <span>{link.label}</span>
                                    {link.badge && (
                                      <span className="rpg-link-badge">
                                        {link.badge}
                                      </span>
                                    )}
                                    <TbExternalLink />
                                  </a>
                                )
                              )}
                          </div>
                        </div>

                        {selectedMission.project.image && (
                          <div className="rpg-project-media">
                            <img
                              src={selectedMission.project.image}
                              alt={selectedMission.project.title}
                              className="rpg-project-img"
                            />
                            <div className="rpg-project-media-overlay"></div>
                          </div>
                        )}

                        <div className="rpg-project-desc-wrap">
                          <p className="rpg-project-desc">
                            {selectedMission.project.description}
                          </p>
                        </div>

                        {/* Live Production Deployments (Landing Page & Hidden Agency Portal) */}
                        {selectedMission.project.liveLinks &&
                          selectedMission.project.liveLinks.length > 0 && (
                            <div className="rpg-live-links-block">
                              <span className="rpg-sub-label">
                                PRODUCTION DEPLOYMENTS // LIVE WORK
                              </span>
                              <div className="rpg-live-links-grid">
                                {selectedMission.project.liveLinks.map(
                                  (link, idx) => (
                                    <a
                                      key={idx}
                                      href={link.url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className={`rpg-live-link-card ${
                                        idx === 1 ? "admin-card" : ""
                                      }`}
                                    >
                                      <div className="rpg-live-link-info">
                                        <div className="rpg-live-link-top">
                                          <span className="live-status-pulse"></span>
                                          <span className="rpg-live-link-title">
                                            {link.label}
                                          </span>
                                          {link.badge && (
                                            <span className="rpg-live-badge">
                                              {link.badge}
                                            </span>
                                          )}
                                        </div>
                                        <span className="rpg-live-link-url">
                                          {link.url.replace(/^https?:\/\//, "")}
                                        </span>
                                        {link.description && (
                                          <p className="rpg-live-link-desc">
                                            {link.description}
                                          </p>
                                        )}
                                      </div>
                                      <div className="rpg-live-link-arrow">
                                        <TbExternalLink />
                                      </div>
                                    </a>
                                  )
                                )}
                              </div>
                            </div>
                          )}

                        {selectedMission.project.features &&
                          selectedMission.project.features.length > 0 && (
                            <div className="rpg-project-features-block">
                              <span className="rpg-sub-label">
                                CORE CAPABILITIES & SYSTEM FEATURES
                              </span>
                              <ul className="rpg-project-features-list">
                                {selectedMission.project.features.map(
                                  (feat, i) => (
                                    <li key={i}>
                                      <span className="feature-bullet">▸</span>
                                      <span>{feat}</span>
                                    </li>
                                  )
                                )}
                              </ul>
                            </div>
                          )}

                        {selectedMission.project.techGroups &&
                          selectedMission.project.techGroups.length > 0 && (
                            <div className="rpg-project-tech-block">
                              <span className="rpg-sub-label">
                                ARCHITECTURAL TECHNOLOGY STACK
                              </span>
                              <div className="rpg-tech-groups-grid">
                                {selectedMission.project.techGroups.map(
                                  (group, idx) => (
                                    <div
                                      key={idx}
                                      className="rpg-tech-group-item"
                                    >
                                      <span className="rpg-tech-group-name">
                                        {group.category}
                                      </span>
                                      <div className="rpg-tech-group-chips">
                                        {group.items.map((tech, tIdx) => (
                                          <span
                                            key={tIdx}
                                            className="rpg-tech-chip"
                                          >
                                            {tech}
                                          </span>
                                        ))}
                                      </div>
                                    </div>
                                  )
                                )}
                              </div>
                            </div>
                          )}
                      </div>
                    </div>
                  )}

                  {/* Attached Certificates in Mission */}
                  {selectedMission.certificates &&
                    selectedMission.certificates.length > 0 && (
                      <div className="rpg-modal-section cert-section">
                        <h5>INTERNSHIP COMPLETION CERTIFICATES</h5>
                        <div className="modal-certs-grid">
                          {selectedMission.certificates.map((cert) => (
                            <div key={cert.id} className="modal-cert-item">
                              <div className="modal-cert-icon">
                                <TbCertificate />
                              </div>
                              <div className="modal-cert-info">
                                <h6>{cert.title}</h6>
                                <span>
                                  {cert.issuer} · {cert.issueDate}
                                </span>
                              </div>
                              <div className="modal-cert-actions">
                                {cert.filePath ? (
                                  <button
                                    className="modal-cert-view-btn"
                                    onClick={() => {
                                      setSelectedMission(null);
                                      setSelectedMilestone(null);
                                      setActiveCertificate(cert);
                                      setIsCertFullscreen(true);
                                      setIsZoomed(false);
                                    }}
                                  >
                                    <TbFileText /> View Credential
                                  </button>
                                ) : (
                                  <button
                                    className="modal-cert-view-btn pending-btn"
                                    onClick={() => {
                                      setSelectedMission(null);
                                      setSelectedMilestone(null);
                                      setActiveCertificate(cert);
                                      setIsCertFullscreen(true);
                                      setIsZoomed(false);
                                    }}
                                  >
                                    <TbFileText /> View Placeholder
                                  </button>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                  {/* Letter of Recommendation (Rendered ONLY if present — e.g. 3Folks Tracks A & B, NO LOR for Jayco) */}
                  {selectedMission.lorCertificate && (
                    <div className="rpg-modal-section cert-section">
                      <h5>LETTER OF RECOMMENDATION (LOR)</h5>
                      <div className="modal-certs-grid">
                        <div className="modal-cert-item">
                          <div className="modal-cert-icon">
                            <TbFileText />
                          </div>
                          <div className="modal-cert-info">
                            <h6>{selectedMission.lorCertificate.title}</h6>
                            <span>
                              {selectedMission.lorCertificate.issuer} ·{" "}
                              {selectedMission.lorCertificate.issueDate}
                            </span>
                          </div>
                          <div className="modal-cert-actions">
                            {selectedMission.lorCertificate.filePath ? (
                              <button
                                className="modal-cert-view-btn"
                                onClick={() => {
                                  setSelectedMission(null);
                                  setSelectedMilestone(null);
                                  setActiveCertificate(
                                    selectedMission.lorCertificate as Certificate
                                  );
                                  setIsCertFullscreen(true);
                                  setIsZoomed(false);
                                }}
                              >
                                <TbFileText /> View LOR
                              </button>
                            ) : (
                              <button
                                className="modal-cert-view-btn pending-btn"
                                onClick={() => {
                                  setSelectedMission(null);
                                  setSelectedMilestone(null);
                                  setActiveCertificate(
                                    selectedMission.lorCertificate as Certificate
                                  );
                                  setIsCertFullscreen(true);
                                  setIsZoomed(false);
                                }}
                              >
                                <TbFileText /> View LOR Placeholder
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="rpg-terminal-box">
                    <code>&gt; {selectedMission.terminalLog}</code>
                  </div>
                </div>
              </div>
            </div>,
            document.body
          )}

        {/* ==========================================================
            06. HOLOGRAPHIC ACADEMIC MILESTONE MODAL (PORTAL)
            ========================================================== */}
        {typeof document !== "undefined" &&
          selectedMilestone &&
          createPortal(
            <div
              className="rpg-modal-overlay"
              onClick={closeAllModals}
            >
              <div
                className="rpg-modal-window"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="rpg-modal-header">
                  <div>
                    <span className="rpg-hud-chip mini">
                      {selectedMilestone.level} // {selectedMilestone.tier}
                    </span>
                    <h3 className="rpg-modal-title">
                      {selectedMilestone.qualification}
                    </h3>
                  </div>
                  <button
                    className="rpg-close-btn"
                    onClick={closeAllModals}
                    aria-label="Close modal"
                  >
                    <TbX />
                  </button>
                </div>

                <div className="rpg-modal-body">
                  <div className="rpg-modal-meta">
                    <div>
                      <span className="rpg-meta-t">INSTITUTION</span>
                      <span className="rpg-meta-d">
                        {selectedMilestone.institution}
                      </span>
                    </div>
                    <div>
                      <span className="rpg-meta-t">TIMELINE</span>
                      <span className="rpg-meta-d">
                        {selectedMilestone.period}
                      </span>
                    </div>
                    <div>
                      <span className="rpg-meta-t">MILESTONE STATUS</span>
                      <span
                        className={`rpg-meta-d ${
                          selectedMilestone.status === "COMPLETED"
                            ? "status-ok"
                            : "status-active-pursuit"
                        }`}
                      >
                        {selectedMilestone.status === "COMPLETED" ? (
                          <>
                            <TbCheck /> MILESTONE ACHIEVED
                          </>
                        ) : (
                          <>
                            <span className="status-pulse-ring mini"></span> MILESTONE TO BE ACHIEVED
                          </>
                        )}
                      </span>
                    </div>
                  </div>

                  <div className="rpg-modal-section">
                    <h5>ACADEMIC OVERVIEW</h5>
                    <p>{selectedMilestone.description}</p>
                  </div>

                  <div className="rpg-modal-section">
                    <h5>CORE ACHIEVEMENTS & FOCUS</h5>
                    <ul className="rpg-directives-list">
                      {selectedMilestone.achievements.map((ach, i) => (
                        <li key={i}>{ach}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="rpg-modal-section">
                    <h5>CORE COMPETENCIES ACQUIRED</h5>
                    <div className="rpg-tools-flex">
                      {selectedMilestone.competencies.map((c, i) => (
                        <span key={i} className="rpg-tool-badge">
                          {c}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Attached Certificates in Milestone */}
                  {selectedMilestone.certificates &&
                    selectedMilestone.certificates.length > 0 && (
                      <div className="rpg-modal-section cert-section">
                        <h5>INSTITUTIONAL CREDENTIALS</h5>
                        <div className="modal-certs-grid">
                          {selectedMilestone.certificates.map((cert) => (
                            <div key={cert.id} className="modal-cert-item">
                              <div className="modal-cert-icon">
                                <TbCertificate />
                              </div>
                              <div className="modal-cert-info">
                                <h6>{cert.title}</h6>
                                <span>
                                  {cert.issuer} · {cert.issueDate}
                                </span>
                              </div>
                              <button
                                className="modal-cert-view-btn"
                                onClick={() => {
                                  setSelectedMission(null);
                                  setSelectedMilestone(null);
                                  setActiveCertificate(cert);
                                  setIsCertFullscreen(true);
                                  setIsZoomed(false);
                                }}
                              >
                                <TbFileText /> View Credential
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                </div>
              </div>
            </div>,
            document.body
          )}

        {/* ==========================================================
            07. CERTIFICATE VAULT & CINEMATIC CREDENTIAL VIEWER (PORTAL)
            ========================================================== */}
        {typeof document !== "undefined" &&
          activeCertificate &&
          createPortal(
            <div
              className={`cert-vault-overlay ${isCertFullscreen ? "is-fullscreen" : ""}`}
              onClick={closeAllModals}
            >
              <div
                className={`cert-vault-modal ${isCertFullscreen ? "is-fullscreen" : ""}`}
                onClick={(e) => e.stopPropagation()}
              >
                {/* Header */}
                <div className="cert-vault-header">
                  <div className="cert-header-info">
                    <div className="cert-hud-badge">
                      <TbAward className="badge-icon" />
                      <span>CREDENTIAL VAULT // ID: {activeCertificate.id.toUpperCase()}</span>
                    </div>
                    <h3 className="cert-title">{activeCertificate.title}</h3>
                    <span className="cert-issuer">
                      Issued by: {activeCertificate.issuer} · {activeCertificate.issueDate}
                    </span>
                  </div>

                  <div className="cert-header-actions">
                    {/* Image Zoom Toggle */}
                    {activeCertificate.fileType === "image" && activeCertificate.filePath && (
                      <button
                        className={`cert-btn-icon ${isZoomed ? "active" : ""}`}
                        onClick={() => setIsZoomed(!isZoomed)}
                        title={isZoomed ? "Reset Zoom" : "Zoom Document"}
                        aria-label="Toggle zoom"
                      >
                        {isZoomed ? <TbZoomOut /> : <TbZoomIn />}
                      </button>
                    )}

                    {/* Fullscreen Toggle */}
                    <button
                      className={`cert-btn-icon ${isCertFullscreen ? "active" : ""}`}
                      onClick={() => setIsCertFullscreen(!isCertFullscreen)}
                      title={isCertFullscreen ? "Exit Fullscreen (Theater View)" : "Fullscreen View"}
                      aria-label="Toggle fullscreen"
                    >
                      {isCertFullscreen ? <TbMinimize /> : <TbMaximize />}
                    </button>

                    {/* Open Original in New Tab */}
                    {activeCertificate.filePath && (
                      <a
                        href={activeCertificate.filePath}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="cert-btn-icon"
                        title="Open Original Document in New Tab"
                        aria-label="Open in new tab"
                      >
                        <TbExternalLink />
                      </a>
                    )}

                    {/* Download File */}
                    {activeCertificate.filePath && (
                      <a
                        href={activeCertificate.filePath}
                        download
                        className="cert-btn-icon"
                        title="Download Credential Document"
                        aria-label="Download credential"
                      >
                        <TbDownload />
                      </a>
                    )}

                    {/* Close Modal */}
                    <button
                      className="cert-btn-icon close"
                      onClick={closeAllModals}
                      title="Close Credential Vault (Esc)"
                      aria-label="Close certificate modal"
                    >
                      <TbX />
                    </button>
                  </div>
                </div>

                {/* Main Document Preview Area */}
                <div className="cert-vault-body">
                  {activeCertificate.filePath ? (
                    activeCertificate.fileType === "pdf" ? (
                      <div className="cert-document-wrapper">
                        <iframe
                          src={`${activeCertificate.filePath}#toolbar=0&navpanes=0&view=Fit`}
                          title={activeCertificate.title}
                          className="cert-pdf-frame"
                        />
                      </div>
                    ) : (
                      <div
                        className={`cert-image-wrapper ${isZoomed ? "zoomed" : ""}`}
                        onClick={() => setIsZoomed(!isZoomed)}
                        title={isZoomed ? "Click to reset zoom" : "Click to zoom"}
                      >
                        <img
                          src={activeCertificate.filePath}
                          alt={activeCertificate.title}
                          className="cert-image-render"
                        />
                      </div>
                    )
                  ) : (
                    /* Subtle Holographic Pending State (No fake docs) */
                    <div className="cert-pending-vault-state">
                      <div className="cert-pending-glow-shield">
                        <TbAward className="shield-icon" />
                        <div className="shield-ring"></div>
                      </div>

                      <div className="cert-pending-text">
                        <span className="pending-protocol">
                          CREDENTIAL PROTOCOL // ARCHIVE_RECORD_VERIFIED
                        </span>
                        <h4>{activeCertificate.title}</h4>
                        <p>
                          Institutional record verified for completion under{" "}
                          <strong>{activeCertificate.issuer}</strong> ({activeCertificate.issueDate}).
                        </p>

                        <div className="cert-spec-grid">
                          <div className="cert-spec-box">
                            <span className="spec-label">DOCUMENT STATUS</span>
                            <span className="spec-val ok">VERIFIED INSTITUTIONAL RECORD</span>
                          </div>
                          <div className="cert-spec-box">
                            <span className="spec-label">ISSUING ENTITY</span>
                            <span className="spec-val">{activeCertificate.issuer}</span>
                          </div>
                          <div className="cert-spec-box">
                            <span className="spec-label">ENCRYPTION ID</span>
                            <span className="spec-val code">
                              SYS//HASH_{activeCertificate.id.replace(/[^a-zA-Z0-9]/g, "").toUpperCase()}
                            </span>
                          </div>
                          <div className="cert-spec-box">
                            <span className="spec-label">FILE ARCHIVE</span>
                            <span className="spec-val pending">
                              READY FOR LOCAL BINDING (/public/certificates/)
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Footer Toolbar */}
                <div className="cert-vault-footer">
                  <div className="cert-footer-status">
                    <span className="cert-status-dot"></span>
                    <code>
                      SECURE VAULT // VERIFIED CREDENTIAL ARCHIVE //{" "}
                      {isCertFullscreen ? "MODE: FULLSCREEN" : "MODE: THEATER"}
                    </code>
                  </div>

                  <div className="cert-footer-buttons">
                    {activeCertificate.verificationUrl && (
                      <a
                        href={activeCertificate.verificationUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="cert-action-btn verify"
                      >
                        <TbExternalLink /> Verify Online
                      </a>
                    )}

                    {activeCertificate.filePath && (
                      <a
                        href={activeCertificate.filePath}
                        download
                        className="cert-action-btn download"
                      >
                        <TbDownload /> Download{" "}
                        {activeCertificate.fileType === "image"
                          ? "Image"
                          : "PDF"}
                      </a>
                    )}

                    <button
                      className="cert-action-btn close"
                      onClick={closeAllModals}
                    >
                      Close Vault
                    </button>
                  </div>
                </div>
              </div>
            </div>,
            document.body
          )}
      </div>
      <ScrollIndicator targetId="work" label="SCROLL TO WORK" />
    </div>
  );
};

const missionCode = (m: MissionExperience) => m.missionNumber;

export default Career;
