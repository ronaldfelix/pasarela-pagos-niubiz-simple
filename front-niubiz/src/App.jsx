import { useState } from 'react';
import './App.css';
import axios from 'axios';
import { API_BASE_URL } from './config/BaseUrlApi';

function App() {
  const [amount, setAmount] = useState('');
  const [sessionToken, setSessionToken] = useState('');
  const [showGenerateTokenButton, setShowGenerateTokenButton] = useState(true);

  const handleGenerateToken = async () => {
    if (amount) {
      try {
        const response = await axios.post(
          `${API_BASE_URL}/generate-session-token`,
          { amount: parseFloat(amount) }
        );

        setSessionToken(response.data.sessionToken || '');
        setShowGenerateTokenButton(false);
      } catch (error) {

      }
    } else {
      alert('Por favor, ingresa una cantidad válida.');
    }
  };

  const openForm = () => {
    if (!sessionToken) {
      alert('Por favor, genera primero el token de sesión.');
      return;
    }

    const VisanetCheckout = window.VisanetCheckout;
    if (VisanetCheckout) {
      VisanetCheckout.configure({
        sessiontoken: sessionToken,
        channel: 'web',
        merchantid: '456879852',
        purchasenumber: '2020100901',
        amount: parseFloat(amount),
        expirationminutes: '5',
        timeouturl: 'about:blank',
        merchantlogo: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSzTo_xqutQBaVtbsOG4mduVSz2QEG7GN7tBA&s', // URL que cambia en produccion
        formbuttoncolor: '#000000',
        action: 'http://localhost:8080/api/niubiz/response-form',
        complete: function (params) {
          console.log('Pago completado:', params);
          alert('Pago completado: ' + JSON.stringify(params));
        },
      });

      VisanetCheckout.open();
    } else {
      alert('No se pudo cargar VisanetCheckout. Verifica que el script esté correctamente cargado.');
    }
  };

  return (
    <>
      <div className="card">
        <label htmlFor="amount" style={{ display: 'block', marginBottom: '8px' }}>
          Ingrese una cantidad monetaria:
        </label>
        <input
          id="amount"
          type="number"
          placeholder="0.00"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          style={{
            padding: '8px',
            fontSize: '16px',
            marginBottom: '16px',
            width: '100%',
            maxWidth: '300px',
          }}
        />
        {showGenerateTokenButton && (
          <button
            onClick={handleGenerateToken}
            style={{
              padding: '10px 20px',
              fontSize: '16px',
              backgroundColor: '#007BFF',
              color: '#fff',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
            }}
          >
            Comprar
          </button>
        )}
        {!showGenerateTokenButton && sessionToken && (
          <button
            onClick={openForm}
            style={{
              marginTop: '16px',
              padding: '10px 20px',
              fontSize: '16px',
              backgroundColor: '#28a745',
              color: '#fff',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
            }}
          >
            Pagar
          </button>
        )}
      </div>
    </>
  );
}

export default App;
