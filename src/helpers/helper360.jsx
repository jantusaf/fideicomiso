const apiUrl = 'https://api.pagos360.com/payment-request';
const apiKey = '<API Key>';



//const helpers1 = {}
export const creardebin = async (nivell) => {
   
const requestData = {
    payment_request: {
      description: 'concepto_del_pago',
      first_due_date: '27-01-2022',
      first_total: 1167.34,
      payer_name: 'nombre_pagador'
    }
  };
  
  axios.post(apiUrl, requestData, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    }
  })
    .then(response => {
      console.log(response.data);
    })
    .catch(error => {
      console.error(error);
    });
  
};

const axios = require('axios');

