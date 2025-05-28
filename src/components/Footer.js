import React from 'react';
// For a more polished look, you might consider using an icon library like react-icons
// npm install react-icons
import { FaInstagram, FaFacebook, FaDiscord, FaGithub, FaEnvelope } from 'react-icons/fa';

const Footer = () => {
    return (
        <footer className="app-footer">
            <div className="footer-content">
                <div className="footer-section contact-info">
                    <h4>Contact Me</h4>
                    <p>
                        <FaEnvelope />
                        Email: <a href="mailto:Fxastolf@gmail.com">Fxastolf@gmail.com</a>
                    </p>
                    <p>Let's connect!</p>
                </div>
                <div className="footer-section social-media">
                    <h4>Follow Me</h4>
                    <div className="social-links-container">
                        <a href="https://www.instagram.com/dusugerdrittl" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                            <FaInstagram /> <span>Instagram</span>
                        </a>
                        <a href="https://www.facebook.com/DuSugerDrittL" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                            <FaFacebook /> <span>Facebook</span>
                        </a>
                        <a href="https://discordapp.com/users/735563580270968913" target="_blank" rel="noopener noreferrer" aria-label="Discord">
                            <FaDiscord /> <span>Discord</span>
                        </a>
                        <a href="https://github.com/Dushugerdrittl" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
                            <FaGithub /> <span>GitHub</span>
                        </a>
                    </div>
                </div>
            </div>
            <div className="footer-bottom">
                <p>&copy; {new Date().getFullYear()} Baby Buritos Collections/Banana. All Rights Reserved.</p>
            </div>
        </footer>
    );
};

export default Footer;