import ScrollIndicator from "./ScrollIndicator";
import "./styles/About.css";

const About = () => {
  return (
    <div className="about-section" id="about">
      <div className="about-me">
        <span className="about-kicker">// 01 • OVERVIEW</span>
        <h3 className="title">About Me</h3>
        <p className="para">
          I'm a passionate full-stack developer and UI/UX designer blending
          robust architecture with clean interface design. Focused on building
          scalable web applications, mobile solutions, and high-performance
          digital systems with modern technologies.
        </p>
      </div>
      <ScrollIndicator targetId="what-i-do" label="SCROLL TO EXPLORE" />
    </div>
  );
};

export default About;
