// src/components/Services.jsx

import React, {useEffect, useState} from 'react';
import texts from "../assets/components-data/servicesSectionData.json";

function  Service ({title, description, aosdelay}) {
  return (
    <div className="col-lg-4 col-md-6" data-aos="fade-up" data-aos-delay={aosdelay}>
            <div className="service-item position-relative">
              <div className="icon">
                <i className="fas fa-heartbeat"></i>
              </div>
              <a href="#" className="stretched-link">
                <h3>{title}</h3>
              </a>
              <p>{description}</p>
            </div>
          </div>
  );
}

function Services({ language }) {
  const [content, setContent] = useState(texts[language]);

  // Dependiendo del idioma, se muestra un texto u otro
  useEffect(() => {
    setContent(texts[language]);
  }, [language]);

  return (
    <section id="services" className="services section">
      {/* Section Title */}
      <div className="container section-title" data-aos="fade-up">
        <h2>{content.sectionTitle}</h2>
        <p>{content.sectionIntroduction}</p>
      </div>

      <div className="container">
        <div className="row gy-4">
          <Service title={content.firstComponentTitle} description={content.firstComponentDescription} aosdelay={"100"}/>
          <Service title={content.secondComponentTitle} description={content.secondComponentDescription} aosdelay={"300"}/>
          <Service title={content.thirdComponentTitle} description={content.thirdComponentDescription} aosdelay={"600"}/>
        </div>
      </div>
    </section>
  );
}

export default Services;
