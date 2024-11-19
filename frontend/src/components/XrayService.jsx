import React, { useState, useRef, useEffect } from 'react';
import { IoMdArrowBack } from 'react-icons/io';
import { IoInformationCircle } from 'react-icons/io5';
import '../assets/css/XrayService.css';
import { useJwt } from "react-jwt";
import infoData from '../assets/components-data/infoData.json';
import xrayData from '../assets/components-data/xrayServiceData.json';
import { useToken } from '../hooks/useToken';
import { useGetDoctors } from '../hooks/useGetDoctors';
import Spinner from './Spinner';

// Component to display the table of doctors
const DoctorTable = ({ doctors, content, tableRef }) => (
  <div ref={tableRef}>
    <hr className="divider" />
    <h2 className='h2'><b>{content.doctors}</b></h2>
    <div className="table-container">
      <table className="doctor-table">
        <thead>
          <tr>
            <th>{content.doctorsName}</th>
            <th>{content.doctorsSpeciality}</th>
            <th>{content.doctorsID}</th>
            <th>{content.contactEmail}</th>
          </tr>
        </thead>
        <tbody>
          {doctors.map((doctor, index) => (
            <tr key={index}>
              <td>{doctor.first_name} {doctor.last_name}</td>
              <td>{doctor.speciality}</td>
              <td>{doctor.dni}</td>
              <td><a href={`mailto:${doctor.email}`}>{doctor.email}</a></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

const XrayService = ({ setView, language, setIsTransitioning, isTransitioning }) => {
  // State to manage component data
  const [state, setState] = useState({
    message: '',
    openSection: '',
    imageUrl: '',
    selectedFile: null,
    pdfBlob: null,
    isUploadVisible: true,
    isScanning: false,
    showTable: false,
    content: xrayData[language],
    data: infoData[language],
  });

  const tableRef = useRef(null);
  const { token, messageToken } = useToken();
  const { decodedToken, isExpired } = useJwt(token);
  const { doctors, messageDoctors } = useGetDoctors();

  // Update content when language changes
  useEffect(() => {
    setState((prev) => ({
      ...prev,
      content: xrayData[language],
      data: infoData[language],
    }));
  }, [language]);

  // Handle file upload
  const handleFileUpload = async (file) => {
    if (!file) return;
    const formData = new FormData();
    formData.append('file', file);
    if (token && decodedToken) {
      try {
        const response = await fetch('http://localhost:5000/image/upload_xray_photo', {
          method: 'POST',
          headers: { 'Authorization': token },
          body: formData,
        });
        const data = await response.json();
        setState((prev) => ({
          ...prev,
          imageUrl: data.image_url,
          isUploadVisible: false,
        }));
      } catch (error) {
        console.error('Error uploading the image:', error);
      }
    }
  };

  // Handle file input change
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setState((prev) => ({ ...prev, selectedFile: file }));
    handleFileUpload(file);
  };

  let timer;

  // Handle scan button click
  const handleScanClick = async () => {
    if (!state.imageUrl) return console.log('No image uploaded.');
    setState((prev) => ({ ...prev, isScanning: true }));
    const formData = new FormData();
    formData.append('image_url', state.imageUrl);
    if (token && decodedToken) {
      try {
        timer = setTimeout(() => {
          setState((prev) => ({ ...prev, isScanning: false }));
        }, 4000);
        const response = await fetch('http://localhost:5000/xray/xray_diagnosis', {
          headers: { 'Authorization': token },
          method: 'POST',
          credentials: 'include',
          body: formData,
        });
        const blob = await response.blob();
        setState((prev) => ({ ...prev, pdfBlob: blob }));
      } catch (error) {
        console.error('Error sending the image to the backend or receiving the PDF:', error);
        setState((prev) => ({ ...prev, isScanning: false }));
      } finally {
        setState((prev) => ({ ...prev, isScanning: false }));
        clearTimeout(timer);
      }
    }
  };

  // Handle PDF download
  const handleDownloadClick = () => {
    if (!state.pdfBlob) return;
    const url = window.URL.createObjectURL(state.pdfBlob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'diagnosis.pdf');
    document.body.appendChild(link);
    link.click();
    link.parentNode.removeChild(link);
    setState((prev) => ({ ...prev, showTable: true }));
    setTimeout(() => {
      if (tableRef.current) {
        tableRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    }, 0);
  };

  // Open overlay section
  const openOverlaySection = (sectionName) => setState((prev) => ({ ...prev, openSection: sectionName }));
  // Close overlay section
  const closeOverlaySection = () => setState((prev) => ({ ...prev, openSection: '' }));

  const { content, data } = state;

  // Handle view transition out
  const handleTransitionOut = (targetView) => {
    setIsTransitioning("out");
    setTimeout(() => {
      setIsTransitioning("null");
      setView(targetView);
    }, 1500);
  };

  return (
    <section id="xray-section" className="contentXray">
      <div className={isTransitioning=="out" ? "transitionOut-active" : "contentXray"}>
        <header className="xray-header-container">
          <div className="xray-header-content">
            <div className="xray-header-left">
              <button
                onClick={() => setView('home')}
                aria-label="Go back"
                className="xray-header-back-button"
              >
                <IoMdArrowBack className="header-icon" />
              </button>
              <h1 className="xray-header-title">Medilab</h1>
            </div>

            <div className="xray-header-right">
              <button
                onClick={() => openOverlaySection('info')}
                aria-label="Show information"
                className="xray-header-info-button"
              >
                <IoInformationCircle className="header-icon" />
              </button>
            </div>
          </div>
        </header>
        <div className="xrayServices-container">
          <input id="xray-upload" type="file" style={{ display: 'none' }} onChange={handleFileChange} />

          {state.imageUrl && (
            <>
              <div className="xray-pic-container">
                <img src={state.imageUrl} className="xray-pic" alt="Uploaded" />
              </div>
              <button className="scan-button" onClick={handleScanClick} disabled={state.isScanning}>
                <i className="fa-solid fa-expand"></i> {content.startScanning}
              </button>
              {state.isScanning && <Spinner content={content} />}
              <br />
              {state.pdfBlob && (
                <button className="download-button" onClick={handleDownloadClick}>
                  <i className="fa-regular fa-file-pdf"></i> {content.downloadPDF}
                </button>
              )}
              <button className="download-button" onClick={() => document.getElementById('change-file-button').click()} >
                {content.changeXRay}
              </button>
              <input id="change-file-button" type="file" style={{ display: 'none' }} onChange={handleFileChange} />
            </>
          )}

          {state.isUploadVisible && (
            <button className="download-button" onClick={() => document.getElementById('xray-upload').click()}>
              {content.uploadXRay}
            </button>
          )}

          {doctors && state.showTable && <DoctorTable doctors={doctors} content={content} tableRef={tableRef} />}
        </div>

        {state.openSection === 'info' && (
          <OverlaySection content={data} closeOverlaySection={closeOverlaySection} />
        )}
      </div>
    </section>
  );
};

// Overlay section component
const OverlaySection = ({ content, closeOverlaySection }) => (
  <div className="overlay-section active">
    <div className="overlay-content">
      <h2><i className="bi bi-info-square-fill"></i> {content.info}</h2>
      <h3>{content.aboutUs.title}</h3>
      <p>{content.aboutUs.content}</p>
      <h3>{content.methodology.title}</h3>
      <p>{content.methodology.content[0]}</p>
      <ul>
        <li><strong>{content.methodology.content[1].model1.name}:</strong> {content.methodology.content[1].model1.description}</li>
        <li><strong>{content.methodology.content[2].model2.name}:</strong> {content.methodology.content[2].model2.description}</li>
      </ul>
      <h3>{content.detectedDiseases.title}</h3>
      <ul>{content.detectedDiseases.list.map((disease, index) => <li key={index}>- {disease}</li>)}</ul>
      <h3>{content.disclaimer.title}</h3>
      <p>{content.disclaimer.content}</p>
      <h3>{content.credits.title}</h3>
      <p>{content.credits.content}</p>
      <button onClick={closeOverlaySection}>{content.closeButton}</button>
    </div>
  </div>
);

export default XrayService;