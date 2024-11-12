import React, { useEffect, useState } from 'react';
import "../assets/css/myDiagnoses.css";
import { useJwt } from "react-jwt";
import { useToken } from '../hooks/useToken';
import { useObtainData } from '../hooks/useObtainData';

const MyDiagnoses = ({ isOpen, onClose }) => {
  const [myDiagnoses, setMyDiagnoses] = useState([]);
  const [message, setMessage] = useState('');
  const [messageData, setMessageData] = useState('');
  const [dni, setDni] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const { token, messageToken } = useToken();
  const { decodedToken, isExpired } = useJwt(token);

  useObtainData(token, decodedToken, isExpired, setFirstName, setLastName, setEmail, setDni, setMessageData);

  useEffect(() => {
    if (token && decodedToken && isOpen) {
      const fetchMyDiagnoses = async () => {
        try {
          const response = await fetch('http://127.0.0.1:5000/inquiries/my_diagnoses', {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': token,
            },
          });

          if (!response.ok) {
            throw new Error(`Failed to fetch diagnoses. Status: ${response.status} - ${response.statusText}`);
          }

          const data = await response.json();
          console.log("Received data:", data);

          // Asegúrate de que sea un arreglo
          setMyDiagnoses(Array.isArray(data) ? data : []);
        } catch (error) {
          console.error('Error fetching my diagnoses:', error);
          setMessage(`Error fetching diagnoses: ${error.message}`); // Mostrar el mensaje de error completo
          setMyDiagnoses([]);  // Configura un arreglo vacío en caso de error
        }
      };

      fetchMyDiagnoses();
    }
  }, [isOpen, token, decodedToken]);

  // Si no está abierto, retorna null directamente
  if (!isOpen) return null;

  return (
    <div className="modal-overlay-diagnoses">
      <div className="modal-content-diagnoses">
        <h1 className='h1-myDiagnoses'><b>Diagnoses of patient {firstName} {lastName} with DNI: {dni}</b></h1>
        <br />
        {message && <p className="message">{message}</p>}
        <div className="diagnoses-grid">
          {myDiagnoses.map((diagnosis, index) => (
            <div key={index} className="diagnosis-card">
              {diagnosis.image_diagnostic && (
                <div className="diagnosis-image">
                  <img
                    src={diagnosis.image_diagnostic}
                    className="profile-pic"
                    alt="Uploaded"
                  />
                </div>
              )}
              <div className="diagnosis-info">
                <p><b>Date:</b> {new Date(diagnosis.date_result).toLocaleDateString()}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="modal-buttons">
          <button type="button" onClick={onClose}>Back</button>
        </div>
      </div>
    </div>
  );
}

export default MyDiagnoses;