// src/components/ComprobantePDF.jsx
import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

// Estilos del PDF
const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 12,
    fontFamily: 'Helvetica',
  },
  section: {
    marginBottom: 15,
  },
  header: {
    fontSize: 18,
    marginBottom: 10,
    textAlign: 'center',
    textTransform: 'uppercase',
    fontWeight: 'bold',
  },
  label: {
    fontWeight: 'bold',
  },
});

const ComprobantePDF = ({ datos }) => {
  const fecha = new Date().toLocaleDateString();

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.header}>Comprobante de Pago</Text>

        <View style={styles.section}>
          <Text><Text style={styles.label}>Fecha de emisión:</Text> {fecha}</Text>
        </View>

        <View style={styles.section}>
          <Text><Text style={styles.label}>De:</Text> Administración General</Text>
          <Text><Text style={styles.label}>Para:</Text> {datos.nombre}</Text>
        </View>

        <View style={styles.section}>
          <Text><Text style={styles.label}>Monto abonado:</Text> ${Number(datos.monto).toFixed(2)}</Text>
        </View>

        <View style={styles.section}>
          <Text><Text style={styles.label}>Concepto:</Text> Aporte mensual correspondiente al mes de {datos.mes} del año {datos.anio}</Text>
        </View>

        <View style={styles.section}>
          <Text>Este comprobante ha sido generado electrónicamente. Su validez queda sujeta a verificación por parte de la entidad emisora.</Text>
        </View>
      </Page>
    </Document>
  );
};

export default ComprobantePDF;
