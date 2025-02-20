import { useEffect, useState } from 'react';
import axios from 'axios';
import { API_BASE_URL } from './config/BaseUrlApi';

function Response() {
  const [data, setData] = useState({});
  const [authorizationResponse, setAuthorizationResponse] = useState(null);

  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    const transactionToken = query.get('transactionToken');
    const customerEmail = query.get('customerEmail');
    const channel = query.get('channel');

    setData({ transactionToken, customerEmail, channel });

    // Si true(descartar)
    if (true) {
      const purchaseNumber = "2020100901";

      axios
        .post(`${API_BASE_URL}/generate-authorization-token?purchaseNumber=${purchaseNumber}`)
        .then((response) => {
          setAuthorizationResponse(response.data);
        })
    }
  }, []);

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Datos de la Transacción</h1>
      {authorizationResponse && (
        <>
          <p><strong>Token ID:</strong> {authorizationResponse.order.tokenId}</p>
          <p><strong>Estado:</strong> {authorizationResponse.dataMap.STATUS}</p>
          <p><strong>Monto:</strong> {authorizationResponse.order.amount}</p>
          <p><strong>Descripción:</strong> {authorizationResponse.dataMap.ACTION_DESCRIPTION}</p>
        </>
      )}
    </div>
  );
}

export default Response;
