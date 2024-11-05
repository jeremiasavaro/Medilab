import React, { useState, useEffect } from 'react';
import heroBg from '../assets/img/hero-bg.jpg';
import texts from "../assets/components-data/heroData.json";

function Card({ title, description, aosdelay, classIcon }) {
  return (
    <div className="col-xl-4 d-flex align-items-stretch">
      <div className="icon-box" data-aos="zoom-out" data-aos-delay={aosdelay}>
        <i className={classIcon}></i>
        <h4>{title}</h4>
        <p>{description}</p>
      </div>
    </div>
  );
}

function HeroSection({ setView, language }) {
  // Usados para cambiar el idioma del contenido
  const [content, setContent] = useState(texts[language]);

  // Dependiendo del idioma, se muestra un texto u otro
  useEffect(() => {
    setContent(texts[language]); 
  }, [language]);
  return (
    <section id="hero" className="hero section light-background">
      <img src={heroBg} alt="" data-aos="fade-in" />

      <div className="container position-relative">
        <div className="welcome position-relative" data-aos="fade-down" data-aos-delay="100">
          <h2>{content.welcomeTitle}</h2>
          <p></p>
        </div>

        <div className="content row gy-4">
          <div className="col-lg-4 d-flex align-items-stretch">
            <div className="why-box" data-aos="zoom-out" data-aos-delay="200">
              <h3>{content.xrayServiceTitle}</h3>
              <p>{content.xrayServiceDescription}</p>
              <div className="text-center">
                <a href="#xrayService" onClick={() => setView("xrayService")} className="more-btn">
                  <span>{content.accessService}</span>
                  <i className="bi bi-chevron-right"></i>
                </a>
              </div>
            </div>
          </div>

          <div className="col-lg-8 d-flex align-items-stretch">
            <div className="d-flex flex-column justify-content-center">
              <div className="row gy-4">
                <Card title={content.reliabilityTitle} description={content.reliabilityDescription} aosdelay={"300"} classIcon={"bi bi-clipboard-data"}/>
                <Card title={content.rapidDiagnosisTitle} description={content.rapidDiagnosisDescription} aosdelay={"400"} classIcon={"bi bi-gem"}/>
                <Card title={content.friendlyInterfaceTitle} description={content.friendlyInterfaceDescription} aosdelay={"500"} classIcon={"bi bi-inboxes"}/>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;