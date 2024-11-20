import React, { useState, useEffect } from 'react';
import Carousel from 'react-bootstrap/Carousel';
import imgMale from '../assets/img/doctors/docMale.png';
import imgFemale from '../assets/img/doctors/docFemale.webp';
import texts from "../assets/components-data/doctorsData.json";
import { useGetDoctors } from '../hooks/useGetDoctors';

function Doctors({ language }) {
  // Fetch doctors data and message
  const { doctors, messageDoctors } = useGetDoctors();
  // State to hold the content based on the selected language
  const [content, setContent] = useState(texts[language]);

  // Update content when language changes
  useEffect(() => {
    setContent(texts[language]);
  }, [language]);

  return (
    <section id="doctors" className="doctors section">
      <div className="container section-title" data-aos="fade-up">
        <h2>{content.title}</h2>
        <p>{content.phrase}</p>
      </div>

      <Carousel controls={true} indicators={false} interval={null}>
        {doctors && doctors.map((doctor, index) => {
          // Skip odd indexed doctors to pair them
          if (index % 2 !== 0) return null;
          return (
            <Carousel.Item key={doctor.id}>
              <div className="d-flex justify-content-center align-items-center">
                <div className="team-member text-left">
                  {/* Display male doctor image */}
                  {doctor.gender === "Male" && (
                    <img src={imgMale} alt="" className="img-fluid" />
                  )}
                  {/* Display female doctor image */}
                  {doctor.gender === "Female" && (
                    <img src={imgFemale} alt="" className="img-fluid" />
                  )}
                  <div className="info">
                    <h4>{doctor.first_name} {doctor.last_name}</h4>
                    <span>Speciality: {doctor.speciality}</span>
                    <span>Contact: {doctor.email}</span>
                  </div>
                </div>
                {/* Display next doctor if exists */}
                {index + 1 < doctors.length && (
                  <div className="team-member text-left">
                    {doctors[index + 1].gender === "Male" && (
                      <img src={imgMale} alt="" className="img-fluid" />
                    )}
                    {doctors[index + 1].gender === "Female" && (
                      <img src={imgFemale} alt="" className="img-fluid" />
                    )}
                    <div className="info">
                      <h4>{doctors[index + 1].first_name} {doctors[index + 1].last_name}</h4>
                      <span>Speciality: {doctors[index + 1].speciality}</span>
                      <span>Contact: {doctors[index + 1].email}</span>
                    </div>
                  </div>
                )}
              </div>
            </Carousel.Item>
          );
        })}
      </Carousel>
    </section>
  );
}

export default Doctors;