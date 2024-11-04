import React, { useState, useEffect } from 'react';
import '@fortawesome/fontawesome-free/css/all.min.css';
import faqData from '../assets/components-data/faqData.json';

function FAQ({ language }) {
  const [activeIndex, setActiveIndex] = useState(null);
  const [content, setContent] = useState(faqData[language]);

  useEffect(() => {
    setContent(faqData[language]);
  }, [language]);

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section id="faq" className="faq section light-background">
      <div className="container section-title" data-aos="fade-up">
        <h2>{content.title}</h2>
        <p></p>
      </div>

      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-10" data-aos="fade-up" data-aos-delay="100">
            <div className="faq-container">
              {content.questions.map((item, index) => (
                <div
                  key={index}
                  className={`faq-item ${activeIndex === index ? 'faq-active' : ''}`}
                  onClick={() => toggleFAQ(index)}
                >
                  <div className="faq-question">
                    <h3>{item.question}</h3>
                    <span className={`faq-toggle ${activeIndex === index ? 'rotate' : ''}`}>
                      <i className={`fas ${activeIndex === index ? 'fa-chevron-up' : 'fa-chevron-down'}`}></i>
                    </span>
                  </div>
                  <div className={`faq-answer ${activeIndex === index ? 'show' : ''}`}>
                    <p>{item.answer}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default FAQ;