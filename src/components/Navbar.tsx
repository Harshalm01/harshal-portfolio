import React, { useEffect, useState } from "react";
import HoverLinks from "./HoverLinks";
import Logo from "../../public/images/logo.png";
import "./styles/Navbar.css";

// Kept for backward compatibility with existing component imports
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export let smoother: any = null;

const navItems = [
  { label: "ABOUT", href: "#about", id: "about" },
  { label: "CAREER", href: "#career", id: "career" },
  { label: "WORK", href: "#work", id: "work" },
  { label: "CERTIFICATIONS", href: "#certifications", id: "certifications" },
  { label: "CONTACT", href: "#contact", id: "contact" },
];

const Navbar: React.FC = () => {
  const [activeSection, setActiveSection] = useState<string>("landingDiv");
  const [isScrolled, setIsScrolled] = useState<boolean>(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    // IntersectionObserver to spy on active section
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      {
        rootMargin: "-20% 0px -50% 0px",
        threshold: 0,
      }
    );

    const sectionElements = [
      document.getElementById("landingDiv"),
      document.getElementById("about"),
      document.getElementById("what-i-do"),
      document.getElementById("career"),
      document.getElementById("work"),
      document.getElementById("certifications"),
      document.getElementById("techstack"),
      document.getElementById("contact"),
    ];

    sectionElements.forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      observer.disconnect();
    };
  }, []);

  const handleNavClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string
  ) => {
    e.preventDefault();
    const target = document.querySelector(href);
    if (target) {
      const targetTop =
        (target as HTMLElement).getBoundingClientRect().top + window.scrollY;
      window.scrollTo({
        top: targetTop,
        behavior: "smooth",
      });
      if (window.history.pushState) {
        window.history.pushState(null, "", href);
      }
    }
  };

  return (
    <>
      <header className={`header ${isScrolled ? "is-scrolled" : ""}`}>
        <div className="header-inner">
          <a
            href="/#"
            className="navbar-title"
            data-cursor="disable"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: "smooth" });
              if (window.history.pushState) {
                window.history.pushState(null, "", "/#");
              }
            }}
            aria-label="Home"
          >
            <img
              src={Logo}
              alt="Harshal Mehta Logo"
              width={42}
              height={42}
              style={{ filter: "invert(100%)" }}
            />
          </a>

          <nav className="navbar-nav">
            <ul className="navbar-menu">
              {navItems.map((item) => {
                const isActive = activeSection === item.id;
                return (
                  <li
                    key={item.id}
                    className={`nav-item ${isActive ? "is-active" : ""}`}
                  >
                    <a
                      data-href={item.href}
                      href={item.href}
                      onClick={(e) => handleNavClick(e, item.href)}
                      className="nav-link"
                    >
                      <HoverLinks text={item.label} />
                      {isActive && <span className="active-dot" />}
                    </a>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>
      </header>

      <div className="landing-circle1"></div>
      <div className="landing-circle2"></div>
      <div className="nav-fade"></div>
    </>
  );
};

export default Navbar;
