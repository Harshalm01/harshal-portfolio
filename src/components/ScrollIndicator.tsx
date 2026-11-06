import React from "react";
import "./styles/ScrollIndicator.css";

interface ScrollIndicatorProps {
  targetId?: string;
  label?: string;
  isBackToTop?: boolean;
  inline?: boolean;
}

const ScrollIndicator: React.FC<ScrollIndicatorProps> = ({
  targetId = "about",
  label = "SCROLL TO EXPLORE",
  isBackToTop = false,
  inline = false,
}) => {
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (isBackToTop) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      if (window.history.pushState) {
        window.history.pushState(null, "", "/#");
      }
      return;
    }

    if (targetId) {
      const target = document.getElementById(targetId);
      if (target) {
        // Offset for fixed navbar when targeting individual project cards
        const isProjectCard =
          target.classList.contains("work-card") ||
          target.id.startsWith("proj-");
        const navOffset = isProjectCard ? 85 : 0;
        const targetTop = Math.max(
          0,
          target.getBoundingClientRect().top + window.scrollY - navOffset
        );
        window.scrollTo({
          top: targetTop,
          behavior: "smooth",
        });
        if (window.history.pushState) {
          window.history.pushState(null, "", `#${targetId}`);
        }
      }
    }
  };

  return (
    <div
      className={`scroll-indicator-wrap ${inline ? "is-inline" : ""}`}
      aria-hidden="false"
    >
      <button
        type="button"
        className="scroll-indicator-btn"
        onClick={handleClick}
        aria-label={isBackToTop ? "Back to top" : `Scroll to ${targetId}`}
        data-cursor="disable"
      >
        <span className="scroll-indicator-label">{label}</span>
        <span className={`scroll-indicator-icon ${isBackToTop ? "is-up" : ""}`}>
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {isBackToTop ? (
              <>
                <polyline points="18 15 12 9 6 15" />
              </>
            ) : (
              <>
                <polyline points="6 9 12 15 18 9" />
              </>
            )}
          </svg>
        </span>
      </button>
    </div>
  );
};

export default ScrollIndicator;

