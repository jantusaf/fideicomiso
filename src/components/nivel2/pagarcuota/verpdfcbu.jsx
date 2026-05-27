import React from 'react';
import { Button } from '@mui/material';
import servicioLegajos from '../../../services/legajos'; // Ajusta la ruta según sea necesario

const PdfViewer = ({ id }) => {

  const handleClickOpen = async () => {
    try {
      const pdfBlob = await servicioLegajos.traerPdfConstanciacbu(id);
      const url = URL.createObjectURL(pdfBlob);
      window.open(url, '_blank');
    } catch (error) {
      console.error('Error al obtener el PDF:', error);
      alert('Error al cargar el PDF');
    }
  };

  return (
    <>
      <Button variant="outlined" onClick={handleClickOpen}>
        Ver PDF
      </Button>
    </>
  );
};

export default PdfViewer;
