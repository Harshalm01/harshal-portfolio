export interface Certificate {
  id: string;
  title: string;
  issuer: string;
  filePath?: string;
  fileType?: "pdf" | "image";
  issueDate: string;
  verificationUrl?: string;
  status?: "VERIFIED" | "PENDING_UPLOAD";
}

export interface EducationMilestone {
  id: string;
  level: string; // "MILESTONE 01", "MILESTONE 02"
  tier: string; // "FOUNDATION", "SPECIALIZATION"
  title: string;
  qualification: string;
  institution: string;
  startDate: string;
  endDate: string;
  period: string;
  status: "COMPLETED" | "CURRENTLY PURSUING";
  description: string;
  achievements: string[];
  competencies: string[];
  certificates?: Certificate[];
}

export interface ProjectTechGroup {
  category: string;
  items: string[];
}

export interface ProjectLiveLink {
  label: string;
  badge?: string;
  url: string;
  description?: string;
}

export interface ProjectShowcase {
  title: string;
  category?: string;
  repoUrl?: string;
  liveLinks?: ProjectLiveLink[];
  image?: string;
  description: string;
  features: string[];
  techGroups?: ProjectTechGroup[];
}

export interface MissionExperience {
  id: string;
  missionNumber: string; // "MISSION 01", "MISSION 02", etc.
  title: string;
  organization: string;
  role?: string;
  track?: string; // e.g. "TRACK A — INFLUENCER & MUSIC MARKETING"
  workMode?: "Online" | "Offline" | "Hybrid";
  startDate: string;
  endDate: string;
  period: string; // Exact dates: "01/12/2025 – 31/05/2026"
  status: "COMPLETED" | "CURRENTLY ACTIVE";
  description: string;
  directives: string[];
  skills: string[];
  terminalLog: string;
  certificates?: Certificate[];
  lorCertificate?: Certificate; // Separate LOR document (undefined for Jayco)
  project?: ProjectShowcase;   // Dedicated project showcase
}

export interface SkillNode {
  name: string;
  level: string;
  verified: boolean;
  appliedIn: string;
  tags: string[];
  telemetry: string;
}

export interface SkillBranch {
  id: string;
  name: string;
  focus: string;
  nodes: SkillNode[];
}

/* ==========================================================
   EDUCATION MILESTONES (EXPANDABLE DATA-DRIVEN ARCHITECTURE)
   ========================================================== */
export const educationMilestones: EducationMilestone[] = [
  {
    id: "edu-foundation",
    level: "MILESTONE 01",
    tier: "FOUNDATION",
    title: "Diploma in Engineering",
    qualification: "Diploma in Engineering (Computer Engineering)",
    institution:
      "Shree Bhagubhai Mafatlal Polytechnic & College of Engineering, Mumbai",
    startDate: "2023",
    endDate: "2026",
    period: "2023–2026",
    status: "COMPLETED",
    description:
      "Built comprehensive foundations in computing architectures, algorithmic problem solving, hardware interfaces, database systems, and object-oriented software design.",
    achievements: [
      "Graduated with Distinction in Computer Engineering curriculum",
      "Mastered Data Structures, Algorithmic Analysis, C/C++, Java & SQL",
      "Engineered hardware-software integration lab projects and database management schemas",
      "Coordinated academic peer study groups on discrete mathematics and computing architectures",
    ],
    competencies: [
      "Data Structures & C/C++",
      "Computer Architecture",
      "Relational Database Systems",
      "Software Lifecycle & OOP",
    ],
    certificates: [],
  },
  {
    id: "edu-specialization",
    level: "MILESTONE 02",
    tier: "SPECIALIZATION",
    title: "B.Tech in Information Technology",
    qualification: "B.Tech in Information Technology",
    institution:
      "K.J. Somaiya Institute of Technology, Sion, Mumbai",
    startDate: "2026",
    endDate: "2029",
    period: "2026–2029",
    status: "CURRENTLY PURSUING",
    description:
      "Advanced undergraduate degree focusing on scalable cloud distributed architectures, full-stack web systems, mobile engineering with Flutter, cybersecurity, and real-time data platforms.",
    achievements: [
      "Actively pursuing undergraduate degree in Information Technology (2026–2029)",
      "Targeting core mastery in cloud systems, distributed databases, and high-concurrency microservices",
      "Developing high-impact applied platforms: MediTrail (Healthcare Audit)",
      "Specializing in modern JavaScript/TypeScript ecosystems, cloud services (AWS & Supabase), and UI/UX",
    ],
    competencies: [
      "Distributed Cloud Systems",
      "Full-Stack Web Architectures",
      "Information Security & RBAC",
      "Mobile & 3D Interactive Web",
    ],
    certificates: [],
  },
];

/* ==========================================================
   PROFESSIONAL MISSIONS (CHRONOLOGICAL OLDEST TO LATEST)
   ========================================================== */
export const experienceMissions: MissionExperience[] = [
  {
    id: "mission-01",
    missionNumber: "MISSION 01",
    title: "DATA SCIENCE",
    organization: "Acmegrade",
    role: "Data Science Training",
    startDate: "12/12/2023",
    endDate: "12/01/2024",
    period: "12/12/2023 – 12/01/2024",
    workMode: "Online",
    status: "COMPLETED",
    description:
      "Hands-on data exploration, preprocessing and statistical modeling using Python, Pandas, NumPy and data visualization libraries.",
    directives: [
      "Cleaned, normalized, and preprocessed multi-dimensional datasets for statistical pattern analysis.",
      "Engineered automated data preprocessing pipelines using Pandas, NumPy, and scientific computing routines.",
      "Generated insightful charts, correlation matrices, and visual models to communicate core analytical findings.",
    ],
    skills: ["Python", "Pandas", "NumPy", "Data Visualization", "Matplotlib"],
    terminalLog:
      "ACMEGRADE_SYS // MISSION_01 // DATASETS_NORMALIZED // REPORT_VERIFIED",
    certificates: [
      {
        id: "cert-acmegrade-ds",
        title: "Data Science Training & Certification",
        issuer: "Acmegrade",
        filePath: "/certificates/acmegrade.jpg",
        fileType: "image",
        issueDate: "12/01/2024",
        verificationUrl: "https://www.acmegrade.com",
        status: "VERIFIED",
      },
    ],
  },
  {
    id: "mission-02",
    missionNumber: "MISSION 02",
    title: "VISUAL DESIGN",
    organization: "Bambhari",
    role: "UI/UX Designer",
    startDate: "10/12/2024",
    endDate: "10/03/2025",
    period: "10/12/2024 – 10/03/2025",
    workMode: "Online",
    status: "COMPLETED",
    description:
      "Designed engaging digital marketing creatives, LinkedIn visual assets and UI components using Canva with brand alignment.",
    directives: [
      "Designed high-impact LinkedIn posts, brand banners, and digital marketing creatives to elevate brand visibility.",
      "Collaborated cross-functionally with marketing leads to maintain strict visual consistency and brand guidelines.",
      "Optimized digital creative assets across various device viewports, aspect ratios, and digital ad formats.",
    ],
    skills: ["UI/UX Principles", "Canva", "Brand Consistency", "Visual Design", "Social Creatives"],
    terminalLog:
      "BAMBHARI_DESIGN // MISSION_02 // BRAND_ASSETS_COMPILED // 100%_DELIVERED",
    certificates: [
      {
        id: "cert-bambhari-uiux",
        title: "UI/UX Designer Internship Credential",
        issuer: "Bambhari",
        filePath: "/certificates/bambhari.pdf",
        fileType: "pdf",
        issueDate: "10/03/2025",
        status: "VERIFIED",
      },
    ],
  },
  {
    id: "mission-03",
    missionNumber: "MISSION 03",
    title: "APP DEVELOPMENT",
    organization: "Jayco Safety Products Pvt. Ltd.",
    role: "App Development Intern",
    startDate: "01/12/2025",
    endDate: "31/05/2026",
    period: "01/12/2025 – 31/05/2026",
    workMode: "Online",
    status: "COMPLETED",
    description:
      "Contributed as an App Development Intern to the development of a Flutter-based cross-platform mobile application, delivering responsive mobile UI screens, feature integrations, and system-level debugging.",
    directives: [
      "Contributed to Flutter-based mobile application development and cross-platform architecture.",
      "Implemented responsive mobile UI screens and user interface components using Flutter and Dart.",
      "Integrated application functionality, features, and real-time state management.",
      "Conducted thorough debugging, testing, and continuous improvement of application behaviour.",
      "Applied mobile application architecture patterns and modern development workflows.",
    ],
    skills: ["Flutter", "Dart", "Mobile UI", "App Development", "Debugging & Testing", "Supabase"],
    terminalLog:
      "JAYCO_SAFETY // MISSION_03 // FLUTTER_APP_DEPLOYED // MOBILE_UI_DELIVERED // STATUS_COMPLETED",
    project: {
      title: "Jayco Cross-Platform Mobile Application",
      category: "Cross-Platform Mobile App",
      description:
        "A high-performance cross-platform mobile application built with Flutter and Dart, featuring modular UI architecture, real-time data sync, and clean component-driven screen layouts.",
      features: [
        "Flutter-based cross-platform mobile application development",
        "Mobile UI implementation and responsive screen development",
        "Application functionality and feature integration",
        "Debugging, testing and application performance optimization",
        "Understanding mobile application architecture and development workflows",
      ],
      techGroups: [
        {
          category: "Framework & Language",
          items: ["Flutter", "Dart"],
        },
        {
          category: "State & Backend Integration",
          items: ["Supabase", "Real-time Sync", "Modern UI"],
        },
      ],
    },
    certificates: [
      {
        id: "cert-jayco-intern",
        title: "App Development Internship Completion Certificate",
        issuer: "Jayco Safety Products Pvt. Ltd.",
        filePath: "/certificates/jayco.jpeg",
        fileType: "image",
        issueDate: "31/05/2026",
        status: "VERIFIED",
      },
    ],
    // Explicitly NO LOR for Jayco Safety Products as requested
  },
  {
    id: "mission-04",
    missionNumber: "MISSION 04",
    title: "INFLUENCER & MUSIC MARKETING",
    organization: "3Folks Media",
    role: "Influencer & Music Marketing",
    track: "TRACK A — INFLUENCER & MUSIC MARKETING",
    startDate: "20/01/2026",
    endDate: "31/07/2026",
    period: "20/01/2026 – 31/07/2026",
    workMode: "Offline",
    status: "COMPLETED",
    description:
      "Drove end-to-end influencer marketing and music promotion operations, executing creator research and outreach, negotiating promotional rates, and coordinating campaigns with music labels and stakeholders.",
    directives: [
      "Conducted extensive influencer and creator research and outreach to match client campaign goals.",
      "Identified and vetted suitable creators for high-engagement promotional campaigns.",
      "Coordinated end-to-end influencer marketing campaigns and publication schedules.",
      "Communicated directly with influencers and negotiated promotional costs and deliverable agreements.",
      "Worked on music promotion campaigns and promotional reels in direct coordination with music labels.",
      "Interfaced with campaign stakeholders and ensured strict deliverable quality and brand alignment.",
      "Supported daily campaign execution, creator communication channels, and delivery tracking.",
    ],
    skills: [
      "Creator Outreach",
      "Influencer Negotiation",
      "Music Marketing",
      "Campaign Coordination",
      "Promotional Reels",
      "Content Strategy",
      "Stakeholder Management",
    ],
    terminalLog:
      "3FOLKS_MEDIA // MISSION_04_TRACK_A // INFLUENCER_CAMPAIGNS_ACTIVE // MUSIC_PROMO_VERIFIED",
    certificates: [
      {
        id: "cert-3folks-marketing",
        title: "Influencer & Music Marketing Internship Certificate",
        issuer: "3Folks Media",
        filePath: "/certificates/3folks - IM - C.pdf",
        fileType: "pdf",
        issueDate: "31/07/2026",
        status: "VERIFIED",
      },
    ],
    lorCertificate: {
      id: "lor-3folks-marketing",
      title: "Letter of Recommendation — Influencer & Music Marketing",
      issuer: "3Folks Media",
      filePath: "/certificates/3folks - IM - LOR.pdf",
      fileType: "pdf",
      issueDate: "31/07/2026",
      status: "VERIFIED",
    },
  },
  {
    id: "mission-05",
    missionNumber: "MISSION 05",
    title: "SOFTWARE DEVELOPMENT",
    organization: "3Folks Media",
    role: "Software Developer",
    track: "TRACK B — SOFTWARE DEVELOPMENT",
    startDate: "20/01/2026",
    endDate: "31/07/2026",
    period: "20/01/2026 – 31/07/2026",
    workMode: "Offline",
    status: "COMPLETED",
    description:
      "Engineered the Creator Invoice Management Portal at 3Folks Media, building full-stack financial workflows, role-based access control, automated PDF generation, and secure AWS S3 document pipelines.",
    directives: [
      "Architected and implemented the Creator Invoice Management Portal to streamline campaign-linked billing workflows.",
      "Engineered Role-Based Access Control (RBAC) and user/team management systems.",
      "Constructed campaign and creator management modules with linked invoice submissions.",
      "Developed automated invoice generation, PDF document handling, and digital signature capabilities (drawing & uploading).",
      "Integrated AWS S3 cloud storage for secure creator invoice document storage and fast retrieval.",
      "Built multi-stage invoice review, editing, approval, and rejection workflows for finance operations.",
      "Integrated real-time notification streams with Socket.IO and automated email triggers via Nodemailer.",
      "Configured dual-database support for SQLite and PostgreSQL, deploying the production platform on Render.",
    ],
    skills: [
      "Node.js",
      "Express.js",
      "JavaScript",
      "EJS",
      "SQLite",
      "PostgreSQL",
      "AWS S3",
      "Render",
      "Socket.IO",
      "PDFKit",
      "Multer",
      "Nodemailer",
      "bcryptjs",
      "AWS SDK v3",
    ],
    terminalLog:
      "3FOLKS_MEDIA // MISSION_05_TRACK_B // INVOICE_PORTAL_DEPLOYED // AWS_S3_ACTIVE // RENDER_LIVE",
    project: {
      title: "Creator Invoice Management Portal",
      category: "Full-Stack Financial Enterprise System",
      liveLinks: [
        {
          label: "LIVE WORK",
          badge: "Landing Page",
          url: "https://invoices.3folks.com",
          description: "Creator Invoicing & Submission Portal (invoices.3folks.com)",
        },
        {
          label: "AGENCY PORTAL",
          badge: "Hidden Admin",
          url: "https://invoices.3folks.com/admin",
          description: "Internal Financial Review & Approval System (invoices.3folks.com/admin)",
        },
      ],
      description:
        "A full-stack invoice management portal developed to streamline creator invoice submissions, campaign-linked billing, document management and internal financial approval workflows. The system helps manage creator invoices, organize campaign-related financial records and simplify the invoice review and approval process.",
      features: [
        "Role-Based Access Control (RBAC) & user/team management",
        "Campaign and creator management with linked invoicing",
        "Campaign-linked invoice submissions",
        "Invoice generation and PDF document handling",
        "Digital signature support through drawing or uploading signatures",
        "Invoice review, editing, approval and rejection workflows",
        "AWS S3 integration for invoice document storage",
        "Database support for SQLite and PostgreSQL",
        "Notifications and transactional email communication",
        "Real-time event capabilities using Socket.IO",
      ],
      techGroups: [
        {
          category: "Frontend",
          items: ["JavaScript", "EJS"],
        },
        {
          category: "Backend",
          items: ["Node.js", "Express.js"],
        },
        {
          category: "Database",
          items: ["SQLite", "PostgreSQL"],
        },
        {
          category: "Cloud & Deployment",
          items: ["AWS S3", "Render"],
        },
        {
          category: "Libraries & Tools",
          items: [
            "PDFKit",
            "Socket.IO",
            "Multer",
            "Nodemailer",
            "bcryptjs",
            "AWS SDK for JavaScript v3",
          ],
        },
      ],
    },
    certificates: [
      {
        id: "cert-3folks-dev",
        title: "Software Development Internship Certificate",
        issuer: "3Folks Media",
        filePath: "/certificates/3folks - SD - C.pdf",
        fileType: "pdf",
        issueDate: "31/07/2026",
        status: "VERIFIED",
      },
    ],
    lorCertificate: {
      id: "lor-3folks-dev",
      title: "Letter of Recommendation — Software Development",
      issuer: "3Folks Media",
      filePath: "/certificates/3folks - SD - LOR.pdf",
      fileType: "pdf",
      issueDate: "31/07/2026",
      status: "VERIFIED",
    },
  },
];

/* ==========================================================
   DYNAMIC STATS CALCULATOR (ZERO HARDCODED COUNTS)
   ========================================================== */
export const calculateUniverseStats = (
  education: EducationMilestone[],
  missions: MissionExperience[]
) => {
  const totalEducation = education.length;
  const totalMissions = missions.length;
  const eduCerts = education.reduce(
    (acc, e) => acc + (e.certificates ? e.certificates.length : 0),
    0
  );
  const missionCerts = missions.reduce(
    (acc, m) =>
      acc +
      (m.certificates ? m.certificates.length : 0) +
      (m.lorCertificate ? 1 : 0),
    0
  );
  const totalCertificates = eduCerts + missionCerts;

  return {
    totalEducation,
    totalMissions,
    totalCertificates,
  };
};

/* ==========================================================
   TACTICAL SKILL MATRIX BRANCHES (PRESERVED)
   ========================================================== */
export const skillBranches: SkillBranch[] = [
  {
    id: "frontend",
    name: "Frontend Development",
    focus: "Modern responsive web applications & 3D experiences",
    nodes: [
      {
        name: "React & TypeScript",
        level: "Advanced UI",
        verified: true,
        appliedIn: "3D Portfolio & Accounts Dashboard",
        tags: ["Components", "State Architecture", "Virtual DOM"],
        telemetry: "REACT_DOM // COMPONENT_TREE_OPTIMIZED // HIGH_PERF",
      },
      {
        name: "Three.js / React Three Fiber",
        level: "Interactive 3D",
        verified: true,
        appliedIn: "3D Portfolio Character & WebGL Scene",
        tags: ["GLTF Meshes", "Custom Lights", "GSAP Timeline"],
        telemetry: "WEBGL_RENDER // 60FPS_SCENE // SHADOW_PASSES",
      },
      {
        name: "GSAP & Web Animations",
        level: "Fluid Motion",
        verified: true,
        appliedIn: "Tactical HUD & Smooth Scroll Transitions",
        tags: ["ScrollTrigger", "Timeline Scrub", "GPU Motion"],
        telemetry: "GSAP_TWEEN // SCROLL_INTERACTIONS // ZERO_JANK",
      },
      {
        name: "Flutter & Dart",
        level: "Cross-Platform Mobile",
        verified: true,
        appliedIn: "Jayco & RapidWarn Mobile Apps",
        tags: ["Reactive UI", "State Management", "Native Engine"],
        telemetry: "FLUTTER_ENGINE // MULTI_PLATFORM // COMPILED_NATIVE",
      },
      {
        name: "Tailwind CSS & Modern UI",
        level: "Design Systems",
        verified: true,
        appliedIn: "Responsive Portals & Mobile Views",
        tags: ["Breakpoints", "Token Systems", "Dark Theme"],
        telemetry: "CSS_VARS // RESPONSIVE_LAYOUTS // ACCESSIBILITY",
      },
    ],
  },
  {
    id: "backend",
    name: "Backend Development",
    focus: "Scalable server architectures, APIs & runtime environments",
    nodes: [
      {
        name: "Node.js & Express",
        level: "REST API Services",
        verified: true,
        appliedIn: "Accounts Invoicing & Microservices",
        tags: ["Express Routing", "Async Middleware", "REST Endpoints"],
        telemetry: "NODE_RUN // EVENT_LOOP_OPTIMIZED // HIGH_THROUGHPUT",
      },
      {
        name: "Python Core",
        level: "Data & Scripting",
        verified: true,
        appliedIn: "Acmegrade Data Science & Automation",
        tags: ["Pandas / NumPy", "Data Cleaning", "Automation"],
        telemetry: "PY_ENGINE // NUMERICAL_ARRAYS // DATA_PIPELINE",
      },
      {
        name: "Role-Based Authentication",
        level: "Security Architecture",
        verified: true,
        appliedIn: "MediTrail Medical Records & RBAC",
        tags: ["JWT Tokens", "OTP Verification", "Access Control"],
        telemetry: "AUTH_SEC // ENCRYPTED_SESSIONS // RBAC_ACTIVE",
      },
      {
        name: "Real-time WebSockets",
        level: "Live Telemetry",
        verified: true,
        appliedIn: "RapidWarn Disaster Incident Broadcasting",
        tags: ["Bidirectional Sync", "Low Latency", "Event Emitter"],
        telemetry: "SOCKET_SYS // REALTIME_PUSH // STREAM_VERIFIED",
      },
    ],
  },
  {
    id: "database",
    name: "Database Management",
    focus: "Relational modeling, document storage & real-time sync",
    nodes: [
      {
        name: "PostgreSQL & Supabase",
        level: "Relational & RLS",
        verified: true,
        appliedIn: "MediTrail & Aerqon Aviation Data",
        tags: ["Row-Level Security", "Relational Schemas", "Foreign Keys"],
        telemetry: "PG_CORE // ACID_COMPLIANT // RLS_ENFORCED",
      },
      {
        name: "MongoDB & Firestore",
        level: "NoSQL Document Stores",
        verified: true,
        appliedIn: "RapidWarn Incident Logging & Feeds",
        tags: ["BSON Collections", "Dynamic Indexing", "Realtime Streams"],
        telemetry: "NOSQL_DB // DOCUMENT_STORES // EVENT_SYNC",
      },
      {
        name: "MySQL Fundamentals",
        level: "Schema Design",
        verified: true,
        appliedIn: "Diploma Database Engineering Labs",
        tags: ["Complex Joins", "Normalization (3NF)", "Stored Procs"],
        telemetry: "SQL_DIALECT // NORMALIZED_TABLES // TRANSACTIONAL",
      },
      {
        name: "Query Optimization",
        level: "Indexing & Integrity",
        verified: true,
        appliedIn: "High-Throughput Analytics & Search",
        tags: ["B-Tree Indexes", "Execution Plans", "Caching Layers"],
        telemetry: "QUERY_OPT // INDEX_HIT_100% // SUB_MILLISECOND",
      },
    ],
  },
  {
    id: "cloud",
    name: "Cloud & AWS",
    focus: "Cloud microservices, serverless functions & automated hosting",
    nodes: [
      {
        name: "Firebase Cloud Messaging (FCM)",
        level: "Broadcast Alerts",
        verified: true,
        appliedIn: "RapidWarn Emergency Push Broadcasts",
        tags: ["FCM Protocols", "Topic Subscriptions", "Device Tokens"],
        telemetry: "FCM_GATEWAY // DISASTER_ALERTS // BROADCAST_READY",
      },
      {
        name: "Supabase Cloud Architecture",
        level: "Database & Storage",
        verified: true,
        appliedIn: "MediTrail Medical Files & Auth APIs",
        tags: ["Cloud DB Hosting", "Object Storage", "Serverless Edge"],
        telemetry: "CLOUD_BAAS // EDGE_FUNCTIONS // BUCKET_SECURITY",
      },
      {
        name: "Vercel / Cloudflare Deployment",
        level: "CI/CD & Edge CDN",
        verified: true,
        appliedIn: "Portfolio & Client Production Deployments",
        tags: ["Git Deploy Hooks", "Global CDN", "Edge SSL Routing"],
        telemetry: "EDGE_CDN // ZERO_CONFIG // GLOBAL_LATENCY_MIN",
      },
      {
        name: "AWS Cloud Fundamentals",
        level: "Storage & Compute",
        verified: true,
        appliedIn: "S3 Cloud Storage & EC2 Virtual Servers",
        tags: ["AWS S3 Buckets", "IAM Roles", "Security Groups"],
        telemetry: "AWS_INFRA // ISOLATED_VPC // STORAGE_OBJECTS",
      },
    ],
  },
  {
    id: "design",
    name: "UI/UX Design",
    focus: "User-centered design, prototyping, design systems & visuals",
    nodes: [
      {
        name: "Figma Prototyping",
        level: "Wireframes & UI Kits",
        verified: true,
        appliedIn: "Jayco Mobile App & Web UI Flows",
        tags: ["Component Libraries", "Auto-Layout", "User Flows"],
        telemetry: "FIGMA_UI // DESIGN_TOKENS // RAPID_PROTOTYPE",
      },
      {
        name: "Canva Creative Suite",
        level: "Digital Creatives",
        verified: true,
        appliedIn: "Bambhari Brand Creatives & Social Assets",
        tags: ["Brand Assets", "Visual Consistency", "Social Graphics"],
        telemetry: "CANVA_STUDIO // BRAND_ALIGNED // ASSET_EXPORT",
      },
      {
        name: "Design System Architecture",
        level: "Color & Typography",
        verified: true,
        appliedIn: "Consistent Theme Tokens & Color Palettes",
        tags: ["Type Hierarchies", "Palette Systems", "Spacing Scales"],
        telemetry: "DESIGN_TOKENS // ACCESSIBILITY_AA // WCAG_ALIGNED",
      },
      {
        name: "User Journey Mapping",
        level: "UX Research",
        verified: true,
        appliedIn: "MediTrail & RapidWarn User Experience",
        tags: ["Information Arch", "Empathy Maps", "Usability Audits"],
        telemetry: "UX_METRICS // FRICTIONLESS_FLOW // USER_CENTRIC",
      },
    ],
  },
];

