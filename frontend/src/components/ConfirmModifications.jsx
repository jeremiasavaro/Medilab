import React, { useState, useEffect } from 'react';
import "../assets/css/confirmModifications.css"
import confirmModData from '../assets/components-data/confirmModificationsData.json';

const ConfirmModifications = ({ firstName, lastName, address, email, dni, phone, birthDate,
    nationality, province, locality, postalCode, gender, confirmed, notConfirmed, setConfirmModifications, language }) => {

    const [currentPassword, setCurrentPassword] = useState('');
    const [message, setMessage] = useState('');
    // Usados para cambiar el idioma del contenido
    const [content, setContent] = useState(confirmModData[language]);

    // Dependiendo del idioma, se muestra un texto u otro
    useEffect(() => {
        setContent(confirmModData[language]);
    }, [language]);

    if (!notConfirmed) return null;

    const handleConfirmModifications = async (e) => {
      e.preventDefault();

        try {
            const response = await fetch('http://127.0.0.1:5000/user/account', {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({currentPassword, firstName, lastName, address, email, dni, phone, birthDate,
                nationality, province, locality, postalCode, gender,}),
            });
    
            const data = await response.json();
    
            if (response.ok) {
                setMessage(data.message);
                setTimeout(() => confirmed(), 2000); 
            } else {
                setMessage(data.error);
            }
        } catch (error) {
            setMessage('Error en la modificacion de datos');
        }
    };

    return (
      <div className="modal-overlay-confirmModifications">
        <div className="modal-content-confirmModifications">
          <form onSubmit={handleConfirmModifications}>
            <div className="form-group">
              <label htmlFor="currentPassword" className="changes">{content.confirmChanges}</label>
              <br></br>
                  <input
                    type="password"
                    id="currentPassword"
                    placeholder={content.currentPassword}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    required
                />
            </div>
            <div className="modal-buttons">
                <button type="button" onClick={confirmed}>{content.cancel}</button>
                <button type="submit">{content.confirm}</button>
            </div>
            {message && <p className = "message">{message}</p>}
          </form>
        </div>
      </div>
    );
  };
  
  export default ConfirmModifications;