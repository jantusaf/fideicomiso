import React from 'react';
import { PDFViewer, Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';
import logo from "../../../Assets/marcas.png.png";
import Firma from "../../../Assets/firma.jpeg";
import servicioCuotas from '../../../services/cuotas'
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom"
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#ffffff',
    padding: 20,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'stretch',
    borderTop: 1,
    borderBottom: 1,
    
    borderColor: '#000000',
    marginBottom: 20,
    paddingBottom: 10,
    marginTop: 20,
    marginLeft: 20,
    marginRight: 10,
  },
  logo: {
    width: '30%',
    paddingRight: 10,
  },
  logoImage: {
    width: '100%',
  },
  fecha: {
    width: '50%',
    textAlign: 'center',
  },
  detalle: {
    width: '30%',
    textAlign: 'right',
    fontSize: 17,
  },
  tableContainer: {
    marginTop: 50,
    marginBottom: 20,
    marginLeft: 40,
    alignItems: 'center',
    width: '90%',
  },
  tableHeader: {
    backgroundColor: '#cfd8dc',
    flexDirection: 'row',
    borderBottom: 1,
    borderColor: '#000000',
    alignItems: 'center',
    height: 40,
  },
  columnHeader: {
    width: '40%',
    textAlign: 'center',
    fontWeight: 'bold',
    borderRight: 1,
    borderColor: '#000000',
    fontSize: 9, // Ajustar el tamaño de letra
  },
  tableRow: {
    flexDirection: 'row',
    borderBottom: 1,
    borderColor: '#000000',
    alignItems: 'center',
    height: 40,
  },
  cell: {
    width: '40%',
    textAlign: 'center',
    borderRight: 1,
    borderColor: '#000000',
    fontSize: 9, // Ajustar el tamaño de letra
  },
  lastCell: {
    width: '11.11%',
    textAlign: 'center',
    fontSize: 9, // Ajustar el tamaño de letra
  },
  sello: {
    textAlign: 'center',
  },
  selloImage: {
    width: '50%',

  },
  pieDePagina: {
    position: 'absolute',
    bottom: 40,
    left: 40,
    right: 40,
    textAlign: 'left',
    width: '90%',
  },
  pieDePaginaSello: {
    position: 'absolute',
    bottom: 50,
    right: 15,
    left: 420,
    textAlign: 'right',
  },
  pieDePaginaSellodesc: {
    position: 'absolute',
    bottom: 20,
    right: 50,
    left: 380,
    textAlign: 'right',
  }
});


const ComprobantePDF = ({ data }) => {
  let params = useParams()
  let id = params.id
  const [clients, setClients] = useState();
  const [loading, setLoading] = useState(true);
  const [tot, setTot] = useState();



  useEffect(() => {
    getClients()
  }, [])

  const getClients = async () => {

    const dde = await servicioCuotas.verief(id)
    console.log(dde)
    setClients(dde)
    //setTot(clients[1])
    setLoading(false);
  }






  return (
    <>
      {clients ? <>
        <PDFViewer width="100%" height="1000px">
          <Document>
            <Page size="A4">
              <View style={styles.container}>
                <View style={styles.logo}>
                  <Image src={logo} style={styles.logoImage} />
                </View>
                <View style={styles.fecha}>
                  {/*  <Text>Fecha:{clients[0].fecha} </Text> */}
                </View>
                <View style={styles.detalle}>

                  <Text style={{ textAlign: 'left' }}>Detalles deuda </Text>
                  <Text style={{ textAlign: 'left' }}> exigible</Text>

                </View>
              </View>

              <View style={styles.tableContainer}>
                <View style={styles.tableHeader}>
                  <Text style={styles.columnHeader}>ID de pago</Text>
                  <Text style={styles.columnHeader}>Corresponde</Text>

                </View>

                {clients[0].map((ob) =>

                  <View style={styles.tableHeader}>

                    <Text style={styles.columnHeader}>{ob.datoa}</Text>


                    <Text style={styles.columnHeader}>{ob.datob}</Text>

                  </View>
                )}
              </View>
              <View style={styles.pieDePagina}>
                <Text>Fideicomiso Santa Catalina</Text>
                <Text>Dirección: 25 de Mayo 1476</Text>
                <Text>Teléfono: 3795171604 </Text>
                {/* Agrega aquí los datos que desees mostrar */}
              </View>

              <View style={styles.pieDePaginaSello}>
                <Image src={Firma} style={styles.selloImage} />

              </View>

              <View style={styles.pieDePaginaSellodesc}>

                <Text>Santiago Merino </Text>
              </View>
            </Page>
          </Document>
        </PDFViewer>
        <PDFViewer width="100%" height="1000px">
          <Document>
            <Page size="A4">
              <View style={styles.container}>
                <View style={styles.logo}>
                  <Image src={logo} style={styles.logoImage} />
                </View>
                <View style={styles.fecha}>
                  {/*  <Text>Fecha:{clients[0].fecha} </Text> */}
                </View>
                <View style={styles.detalle}>

                  <Text style={{ textAlign: 'left' }}>Detalles de cuotas </Text>
                  <Text style={{ textAlign: 'left' }}> pendientes</Text>
                </View>
              </View>

              <View style={styles.tableContainer}>
         
         

                {clients[1].map((ob) =>

                  <View style={styles.tableHeader}>

                    <Text style={styles.columnHeader}>{ob.datoa}</Text>


                    <Text style={styles.columnHeader}>{ob.datob}</Text>

                  </View>
                )}
              </View>
              <View style={styles.pieDePagina}>
                <Text>Fideicomiso Santa Catalina</Text>
                <Text>Dirección: 25 de Mayo 1476</Text>
                <Text>Teléfono: 3795171604 </Text>
                {/* Agrega aquí los datos que desees mostrar */}
              </View>

              <View style={styles.pieDePaginaSello}>
                <Image src={Firma} style={styles.selloImage} />

              </View>

              <View style={styles.pieDePaginaSellodesc}>

                <Text>Santiago Merino </Text>
              </View>
            </Page>
          </Document>
        </PDFViewer>
      </> : <></>}

    </>
  );
};

export default ComprobantePDF;
