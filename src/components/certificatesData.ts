export interface CertificateItem {
  id: string;
  title: string;
  issuer: string;
  type: string;
  date: string;
  image: string;
  badge: string;
  description: string;
}

export const certificatesData: CertificateItem[] = [
  {
    id: "cert-3folks-internship",
    title: "Influencer Marketing Internship",
    issuer: "3Folks Media",
    type: "Industry Internship",
    date: "June 2025",
    image: "/images/certificates/3folks - 1.png",
    badge: "Verified Internship",
    description:
      "Certificate of Internship awarded for successfully completing a one-month internship in the Influencer Marketing Department at 3Folks Media, officially endorsed by Co-Founder Deep Shah.",
  },
  {
    id: "cert-3folks-best-actor",
    title: "Best Actor of the Month",
    issuer: "3Folks Media",
    type: "Excellence Award",
    date: "June 2026",
    image: "/images/certificates/3folks - 2.png",
    badge: "Honour Award",
    description:
      "Prestigious recognition awarded by Co-Founder Rahil Shah at 3Folks Media for outstanding creativity, dedication, and inspiring the entire agency team.",
  },
  {
    id: "cert-ibm-ai",
    title: "Artificial Intelligence Fundamentals",
    issuer: "IBM SkillsBuild",
    type: "Professional Certification",
    date: "April 2025",
    image: "/images/certificates/IBM - 1.png",
    badge: "IBM Certified",
    description:
      "Credly-verified credential certifying core mastery in Artificial Intelligence Fundamentals, machine learning concepts, neural architectures, and ethical AI from IBM SkillsBuild.",
  },
  {
    id: "cert-ibm-cybersecurity",
    title: "Cybersecurity Fundamentals",
    issuer: "IBM SkillsBuild",
    type: "Professional Certification",
    date: "March 2025",
    image: "/images/certificates/IBM - 2.png",
    badge: "IBM Certified",
    description:
      "Professional credential issued by IBM SkillsBuild demonstrating mastery of foundational cybersecurity principles, defense paradigms, security architectures, and incident handling.",
  },
  {
    id: "cert-java-spoken-tutorial",
    title: "Java Training & Online Assessment",
    issuer: "IIT Bombay Spoken Tutorial & K J Somaiya",
    type: "Academic Specialization",
    date: "November 2026",
    image: "/images/certificates/JAVA SPOKEN TUTORIAL.png",
    badge: "Score: 87.50%",
    description:
      "Completed 4 Credits with an 87.50% score in remote online examination conducted by IIT Bombay Spoken Tutorial (EduPyramids, SINE) organized at K J Somaiya Institute of Engineering & Information Technology.",
  },
  {
    id: "cert-sbmp-appreciation",
    title: "Certificate of Appreciation (TechBeats)",
    issuer: "Shri Bhagubhai Mafatlal Polytechnic (SVKM)",
    type: "Institutional Honor",
    date: "2023 - 2024",
    image: "/images/certificates/SBMP - 1.jpeg",
    badge: "Newsletter Committee",
    description:
      "Recognized by the Computer Engineering Department for outstanding dedication, creativity, and editorial contribution as a member of the Newsletter Committee designing 'TechBeats'.",
  },
  {
    id: "cert-unicef-waste-management",
    title: "Youth Leadership: Waste Management & Climate Action",
    issuer: "UNICEF & CEE (Govt. of Maharashtra)",
    type: "Global Initiative",
    date: "January 2024",
    image: "/images/certificates/UNICEF 1.png",
    badge: "UNICEF Certified",
    description:
      "State-level certification under UNICEF Maharashtra and the Department of Environment & Climate Change in Youth Leadership for Climate Action with specialization in Waste Management.",
  },
  {
    id: "cert-unicef-water-management",
    title: "Living with Climate Change & Water Management",
    issuer: "UNICEF & CEE (Govt. of Maharashtra)",
    type: "Global Initiative",
    date: "July 2024",
    image: "/images/certificates/UNICEF 2.png",
    badge: "UNICEF Certified",
    description:
      "Certified under Majhi Vasundhara 4.0 and UNICEF Maharashtra for climate resilience, community water management, and sustainable environmental practices.",
  },
];
