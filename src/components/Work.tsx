import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MdArrowOutward } from "react-icons/md";
import WorkImage, { GalleryItem } from "./WorkImage";
import CreatorInvoiceCaseStudy from "./CreatorInvoiceCaseStudy";
import ScrollIndicator from "./ScrollIndicator";
import "./styles/Work.css";

gsap.registerPlugin(ScrollTrigger);

export interface ProjectAction {
  label: string;
  url: string;
  type?: "live" | "admin" | "github";
  badge?: string;
}

export interface ProjectItem {
  id: string;
  number: string;
  title: string;
  role?: string;
  category: string;
  about: string;
  tools: string[];
  image: string;
  imageFit?: "contain" | "cover";
  sponsorBadge?: string;
  highlights?: string[];
  actions?: ProjectAction[];
  gallery?: GalleryItem[];
}

const remainingProjects: ProjectItem[] = [
  /* ==========================================================
     02. AERQON AVIATION WEBSITE
     ========================================================== */
  {
    id: "proj-aerqon",
    number: "02",
    title: "Aerqon Aviation",
    role: "Website Developer",
    category: "Complete Website Development",
    about:
      "Developed the complete website for Aerqon Aviation, an aviation training and education brand. The website presents the organisation, its aviation training programmes, services and student-facing information through a professional web experience with bespoke frontend styling and interactive functionality.",
    tools: ["HTML5", "CSS3", "JavaScript"],
    image: "/images/aerqon/01-landing-page.png",
    imageFit: "contain",
    highlights: [
      "Complete frontend architecture and responsive layout development",
      "3D Interactive Plane (rotates 360 degrees on interaction)",
      "3D Circular Gallery (aircraft fleet images rotate 360 degrees)",
      "Interactive website functionality and real-world delivery",
    ],
    actions: [
      {
        label: "VISIT LIVE WEBSITE →",
        url: "https://www.aerqonaviation.com/",
        badge: "aerqonaviation.com",
        type: "live",
      },
    ],
    gallery: [
      {
        image: "/images/aerqon/01-landing-page.png",
        title: "Landing Page",
      },
      {
        image: "/images/aerqon/02-about-us-page.png",
        title: "About Us Page",
      },
      {
        image: "/images/aerqon/03-3d-interactive-plane.png",
        title: "3D Interactive Plane (Rotates 360°)",
      },
      {
        image: "/images/aerqon/04-3d-circular-gallery.png",
        title: "3D Circular Gallery (Rotates 360°)",
      },
    ],
  },

  /* ==========================================================
     03. MEDITRAIL // HEALTHCARE TECHNOLOGY
     ========================================================== */
  {
    id: "proj-meditrail",
    number: "03",
    title: "MediTrail",
    role: "College Mini Project",
    category: "Healthcare Technology | Web Application",
    sponsorBadge: "College Mini Project · Guidance of Dr. Radhika Kotecha",
    about:
      "MediTrail is a Personal Health Record Management System that centralizes patients’ medical information in one accessible digital platform. It features a chronological medical timeline, document management, emergency information and secure record sharing, with separate patient and hospital staff portals powered by role-based access control. Developed under the academic guidance of Dr. Radhika Kotecha.",
    tools: ["JavaScript", "Java", "HTML5", "CSS3"],
    image: "/images/meditrail/01-landing-page.png",
    imageFit: "contain",
    highlights: [
      "Personal Health Record Management System with centralized digital health records",
      "Chronological medical timeline & structured document management",
      "Patient emergency information & controlled sharing of selected records",
      "Role-oriented portals for patients and hospital staff with RBAC security",
      "Faculty guidance: Developed under the guidance of Dr. Radhika Kotecha",
      "Ongoing academic college mini project deployed live on Render",
    ],
    actions: [
      {
        label: "EXPLORE MEDITRAIL →",
        url: "https://meditrail-3ywk.onrender.com/",
        badge: "Render Live",
        type: "live",
      },
    ],
    gallery: [
      {
        image: "/images/meditrail/01-landing-page.png",
        title: "Landing Page",
      },
      {
        image: "/images/meditrail/02-patient-login.png",
        title: "Patient Login",
      },
      {
        image: "/images/meditrail/03-patient-dashboard.jpeg",
        title: "Patient Dashboard",
      },
      {
        image: "/images/meditrail/04-patient-emergency-contact.png",
        title: "Patient Emergency Contact Details",
      },
      {
        image: "/images/meditrail/05-manager-portal.png",
        title: "Manager Portal",
      },
      {
        image: "/images/meditrail/06-hospital-admin-portal.png",
        title: "Hospital Admin Portal",
      },
    ],
  },

  /* ==========================================================
     04. RAPIDWARN // AI-DRIVEN DISASTER NOTIFICATION SYSTEM
     ========================================================== */
  {
    id: "proj-rapidwarn",
    number: "04",
    title: "RapidWarn",
    category: "Man-Made Disaster Notification System",
    sponsorBadge: "Govt. Sponsored Project · Maharashtra Police Endorsement",
    about:
      "An intelligent disaster response system where citizens upload real-time photo and video evidence of emergencies. The media is analyzed by YOLOv8 vision AI to assess severity, automatically plotting color-coded hazards on live interactive maps and dispatching emergency alerts to authorities.",
    tools: [
      "Flutter",
      "YOLOv8 AI",
      "FastAPI",
      "Supabase Realtime",
      "Webhooks",
      "Push Alerts",
      "Google Colab",
    ],
    image: "/images/rapidwarn/01-user-login.png",
    imageFit: "contain",
    highlights: [
      "Real-time citizen reporting with photo & video evidence",
      "YOLOv8 vision AI severity & hazard detection",
      "FastAPI webhooks & Supabase live event streams",
      "Interactive live map with color-coded severity markers",
      "Instant push notifications to emergency responders",
    ],
    gallery: [
      {
        image: "/images/rapidwarn/01-user-login.png",
        title: "User Login",
      },
      {
        image: "/images/rapidwarn/02-onboarding.png",
        title: "Onboarding",
      },
      {
        image: "/images/rapidwarn/03-home-page.png",
        title: "Home Page (Live Map)",
      },
      {
        image: "/images/rapidwarn/04-my-account.png",
        title: "My Account",
      },
      {
        image: "/images/rapidwarn/05-admin-dashboard.png",
        title: "Admin Dashboard",
      },
      {
        image: "/images/rapidwarn/06-active-incidents.png",
        title: "Active Incidents",
      },
      {
        image: "/images/rapidwarn/07-analytics.png",
        title: "Analytics & Heatmaps",
      },
      {
        image: "/images/rapidwarn/08-government-endorsement.jpg",
        title: "Govt. Sponsorship & Police Endorsement",
      },
    ],
  },

  /* ==========================================================
     05. JAYCO // CROSS-PLATFORM BUSINESS SUPPORT APPLICATION
     ========================================================== */
  {
    id: "proj-jayco",
    number: "05",
    title: "Jayco – A Samadhan App",
    role: "App Development Intern",
    category: "Cross-platform Business Support & Document Management Application",
    sponsorBadge: "Developed and used by the company · Six-Month Internship",
    about:
      "Jayco – A Samadhan App is a comprehensive business support and document management platform designed to help MSMEs and business organizations manage dispute-related documentation, complaint registration and payment recovery processes. The platform provides a centralized environment for document organization, complaint workflows, activity tracking and business support. It combines cloud-based services, secure authentication, real-time synchronization and offline recovery mechanisms to improve accessibility, data management and operational efficiency.",
    tools: [
      "Flutter",
      "Dart",
      "Material Design 3",
      "Provider",
      "Firebase Auth",
      "Supabase",
      "PostgreSQL",
      "Supabase Storage",
      "REST APIs",
      "RBAC",
      "Row-Level Security",
      "Real-time Sync",
      "Offline Caching",
      "Git",
    ],
    image: "/images/jayco/01-onboarding-page.png",
    imageFit: "contain",
    highlights: [
      "Flutter & Dart cross-platform mobile application engineering",
      "Firebase Authentication and secure session management",
      "Supabase PostgreSQL database and cloud document storage",
      "Role-Based Access Control (RBAC) and Row-Level Security (RLS)",
      "Real-time synchronization and multi-device data consistency",
      "Offline caching, connectivity recovery and retry mechanisms",
      "Modular document management and complaint workflows",
      "Provider-based state management and responsive UI architecture",
    ],
    gallery: [
      {
        image: "/images/jayco/01-onboarding-page.png",
        title: "01 - Onboarding Page",
      },
      {
        image: "/images/jayco/02-login-page.png",
        title: "02 - Login Page",
      },
      {
        image: "/images/jayco/03-home-screen.png",
        title: "03 - Home Screen",
      },
      {
        image: "/images/jayco/04-document-upload.png",
        title: "04 - Document Upload",
      },
      {
        image: "/images/jayco/05-image-to-pdf-conversion.png",
        title: "05 - Image to PDF Conversion",
      },
      {
        image: "/images/jayco/06-notifications.png",
        title: "06 - Notifications",
      },
      {
        image: "/images/jayco/07-personalized-ai-chatbot.png",
        title: "07 - Personalized AI Chatbot",
      },
    ],
  },
];

const Work = () => {
  const sectionRef = useRef<HTMLElement | null>(null);
  const progressBarRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // Respect user's motion preferences
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReducedMotion || !sectionRef.current) return;

    const ctx = gsap.context(() => {
      // 1. Featured Work section header reveal (triggers early, completes quickly)
      gsap.from(".work-header", {
        scrollTrigger: {
          trigger: ".work-header",
          start: "top 95%",
          end: "top 78%",
          scrub: true,
        },
        opacity: 0,
        y: 25,
        ease: "none",
      });

      // 2. Smooth scroll progress bar scrubbing
      if (progressBarRef.current && sectionRef.current) {
        gsap.fromTo(
          progressBarRef.current,
          { scaleX: 0 },
          {
            scaleX: 1,
            ease: "none",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top top",
              end: "bottom bottom",
              scrub: true,
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className="work-section" id="work" ref={sectionRef}>
      {/* Scroll Progress Bar */}
      <div className="work-scroll-progress-track">
        <div className="work-scroll-progress-bar" ref={progressBarRef} />
      </div>

      <div className="work-container">
        {/* Section Header */}
        <div className="work-header">
          <div className="work-header-badge">
            <span className="badge-dot"></span>
            <span>PORTFOLIO SELECTION // 01 – 05</span>
          </div>
          <h2>
            Featured <span>Work &amp; Engineering</span>
          </h2>
          <p className="work-header-subtitle">
            A curated showcase of production applications, distributed backend
            architectures, mobile platforms, and interactive 3D web systems.
          </p>
        </div>

        {/* Project Cards List */}
        <div className="work-cards-list">
          {/* ==========================================================
              01. 3FOLKS MEDIA // CREATOR INVOICE MANAGEMENT PORTAL
              (Full-Width Vertical Case Study Architecture)
              ========================================================== */}
          <CreatorInvoiceCaseStudy />
          <ScrollIndicator
            targetId="proj-aerqon"
            label="SCROLL TO WORK 02"
            inline
          />

          {/* ==========================================================
              02 – 05. REMAINING PROJECTS (TWO-COLUMN ARCHITECTURE)
              ========================================================== */}
          {remainingProjects.map((project, idx) => (
            <React.Fragment key={project.id}>
              <article
                id={project.id}
                className="work-card"
              >
                {/* Left Column: Project Details */}
                <div className="work-card-info">
                  <div className="work-card-meta">
                    <span className="work-card-num">// {project.number}</span>
                    {project.role && (
                      <span className="work-card-role">· {project.role}</span>
                    )}
                    <span className="work-card-cat">{project.category}</span>
                  </div>

                  <h3 className="work-card-title">{project.title}</h3>

                  {project.sponsorBadge && (
                    <div className="work-sponsor-badge">
                      <span className="sponsor-dot"></span>
                      <span>{project.sponsorBadge}</span>
                    </div>
                  )}

                  <p className="work-card-desc">{project.about}</p>

                  {project.highlights && project.highlights.length > 0 && (
                    <div className="work-highlights-wrap">
                      <span className="work-mini-label">
                        KEY ARCHITECTURE &amp; FOCUS
                      </span>
                      <ul className="work-highlights-list">
                        {project.highlights.map((h, i) => (
                          <li key={i}>
                            <span className="highlight-bullet">▸</span>
                            <span>{h}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="work-tech-wrap">
                    <span className="work-mini-label">VERIFIED TECH STACK</span>
                    <div className="work-tech-chips">
                      {project.tools.map((tool, i) => (
                        <span key={i} className="work-tech-chip">
                          {tool}
                        </span>
                      ))}
                    </div>
                  </div>

                  {project.actions && project.actions.length > 0 && (
                    <div className="work-actions-row">
                      {project.actions.map((act, i) => (
                        <a
                          key={i}
                          href={act.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`work-action-btn ${act.type || ""}`}
                        >
                          <span>{act.label}</span>
                          {act.badge && (
                            <span className="action-badge">{act.badge}</span>
                          )}
                          <MdArrowOutward />
                        </a>
                      ))}
                    </div>
                  )}
                </div>

                {/* Right Column: Visual Container */}
                <div className="work-card-visual">
                  <WorkImage
                    image={project.image}
                    alt={project.title}
                    gallery={project.gallery}
                    imageFit={project.imageFit}
                  />
                </div>
              </article>

              {idx < remainingProjects.length - 1 && (
                <ScrollIndicator
                  targetId={remainingProjects[idx + 1].id}
                  label={`SCROLL TO WORK 0${idx + 3}`}
                  inline
                />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
      <ScrollIndicator targetId="certifications" label="SCROLL TO CERTIFICATIONS" />
    </section>
  );
};

export default Work;
