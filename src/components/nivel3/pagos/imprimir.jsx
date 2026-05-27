import React, { forwardRef } from "react";
import { Box, Typography, Divider } from "@mui/material";
import logo from "../../Assets/logo.png"; 
// ← ajustá la ruta a tu logo

const InformePagosPrint = forwardRef(({ data, filtros }, ref) => {
  return (
    <Box ref={ref} sx={{ padding: "30px", fontFamily: "Arial" }}>
      
      {/* ===== HEADER ===== */}
      <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
        <img src={logo} alt="logo" style={{ height: 70, marginRight: 20 }} />
        <Box>
          <Typography variant="h5" fontWeight="bold">
            Informe de Pagos Inusuales
          </Typography>
          <Typography variant="body2">
            Municipalidad de Corrientes
          </Typography>
          <Typography variant="body2">
            Fecha de emisión: {new Date().toLocaleDateString()}
          </Typography>
        </Box>
      </Box>

      <Divider sx={{ mb: 2 }} />

      {/* ===== FILTROS APLICADOS ===== */}
      <Typography variant="subtitle2" fontWeight="bold">
        Filtros aplicados:
      </Typography>
      <Typography variant="body2" mb={2}>
        Mes: {filtros.mes || "Todos"} | 
        Año: {filtros.anio || "Todos"} | 
        Zona: {filtros.zona || "Todas"}
      </Typography>

      {/* ===== TABLA ===== */}
      <table width="100%" border="1" cellSpacing="0" style={{ borderCollapse: "collapse", fontSize: "12px" }}>
        <thead style={{ background: "#0b4f6c", color: "white" }}>
          <tr>
            <th>Mes</th>
            <th>Año</th>
            <th>Zona</th>
            <th>CUIL/CUIT</th>
            <th>Nombre</th>
            <th>Monto</th>
          </tr>
        </thead>
        <tbody>
          {data.map((p, i) => (
            <tr key={i}>
              <td>{p.mes}</td>
              <td>{p.anio}</td>
              <td>{p.origen === "ic3" ? "IC3" : "PIT"}</td>
              <td>{p.cuil_cuit}</td>
              <td>{p.nombre}</td>
              <td>${p.monto}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* ===== FOOTER ===== */}
      <Typography variant="body2" mt={3}>
        Total de registros: {data.length}
      </Typography>

      <Typography variant="caption" display="block" mt={4}>
        Informe generado automáticamente - Sistema de Pagos
      </Typography>
    </Box>
  );
});

export default InformePagosPrint;