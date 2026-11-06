import {
  FaGithub,
  FaInstagram,
  FaLinkedinIn,
} from "react-icons/fa6";
import { TbNotes } from "react-icons/tb";

import HoverLinks from "./HoverLinks";

import "./styles/SocialIcons.css";

const SocialIcons = () => {
  return (
    <div className="icons-section">
      <div className="social-icons" data-cursor="icons" id="social">
        <span>
          <a href="https://github.com/Harshalm01" target="_blank" rel="noreferrer">
            <FaGithub />
          </a>
        </span>
        <span>
          <a href="https://www.linkedin.com/in/harshalmehta1" target="_blank" rel="noreferrer">
            <FaLinkedinIn />
          </a>
        </span>
        <span>
          <a href="https://www.instagram.com/mehtaharshal01" target="_blank" rel="noreferrer">
            <FaInstagram />
          </a>
        </span>
      </div>
      <a
        className="resume-button"
        href="/resume.pdf"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="View Resume PDF"
      >
        <HoverLinks text="RESUME" />
        <span>
          <TbNotes />
        </span>
      </a>
    </div>
  );
};

export default SocialIcons;
