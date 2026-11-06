import { MdArrowOutward, MdCopyright } from "react-icons/md";
import ScrollIndicator from "./ScrollIndicator";

import "./styles/Contact.css";

const Contact = () => {
  return (
    <div className="contact-section section-container" id="contact">
      <div className="contact-container">
        <h3>Contact</h3>
        <div className="contact-flex">
          <div className="contact-box">
            <h4>Email</h4>
            <p>
              <a
                href="mailto:work.harshalmehta@gmail.com"
                data-cursor="disable"
              >
                work.harshalmehta@gmail.com
              </a>
            </p>
            <h4>Phone</h4>
            <p>
              <a href="tel:+919324476116" data-cursor="disable">
                +91 93244 76116
              </a>
            </p>
            <h4>Location</h4>
            <p>Mumbai, Maharashtra, India</p>
          </div>
          <div className="contact-box">
            <h4>Social</h4>
            <a
              href="https://github.com/Harshalm01"
              target="_blank"
              data-cursor="disable"
              className="contact-social"
            >
              Github <MdArrowOutward />
            </a>
            <a
              href="https://www.linkedin.com/in/harshalmehta1"
              target="_blank"
              data-cursor="disable"
              className="contact-social"
            >
              Linkedin <MdArrowOutward />
            </a>
            <a
              href="https://www.instagram.com/mehtaharshal01"
              target="_blank"
              data-cursor="disable"
              className="contact-social"
            >
              Instagram <MdArrowOutward />
            </a>
          </div>
          <div className="contact-box">
            <h2>
              Designed and Developed <br /> by <span>Harshal Mehta</span>
            </h2>
            <h5>
              <MdCopyright /> 2026
            </h5>
          </div>
        </div>
      </div>
      <ScrollIndicator isBackToTop label="BACK TO TOP" />
    </div>
  );
};

export default Contact;
