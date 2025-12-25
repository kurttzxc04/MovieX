import React from "react";
import {
    FaFacebookF,
    FaInstagram,
    FaTwitter,
    FaLinkedin,
} from "react-icons/fa";

import ContentWrapper from "../contentWrapper/ContentWrapper";

import "./style.scss";

const Footer = () => {
    return (
        <footer className="footer">
            <ContentWrapper>
                <div className="footer__content">
                    <ul className="footer__menu">
                        <li className="footer__menu-item">
                            <a href="#">Terms of Use</a>
                        </li>
                        <li className="footer__menu-item">
                            <a href="#">Privacy Policy</a>
                        </li>
                        <li className="footer__menu-item">
                            <a href="#">About Us</a>
                        </li>
                        <li className="footer__menu-item">
                            <a href="#">Blog</a>
                        </li>
                        <li className="footer__menu-item">
                            <a href="#">FAQ</a>
                        </li>
                    </ul>

                    <p className="footer__text">
                        Movix is your ultimate streaming destination for movies and TV shows.
                        Discover thousands of titles, curated recommendations, and exclusive content.
                        Stream, watch, and enjoy your favorite entertainment anytime, anywhere.
                    </p>

                    <div className="footer__social">
                        <a href="#" className="footer__social-icon" aria-label="Facebook">
                            <FaFacebookF />
                        </a>
                        <a href="#" className="footer__social-icon" aria-label="Instagram">
                            <FaInstagram />
                        </a>
                        <a href="#" className="footer__social-icon" aria-label="Twitter">
                            <FaTwitter />
                        </a>
                        <a href="#" className="footer__social-icon" aria-label="LinkedIn">
                            <FaLinkedin />
                        </a>
                    </div>

                    <div className="footer__bottom">
                        <p>&copy; 2024 Movix. All rights reserved.</p>
                    </div>
                </div>
            </ContentWrapper>
        </footer>
    );
};

export default Footer;
