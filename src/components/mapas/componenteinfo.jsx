import React, { useState, useEffect } from "react";
import servicioLotes from '../../services/lotes';
import { useNavigate } from "react-router-dom";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import PersonIcon from '@mui/icons-material/Person';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';

const InfoRow = ({ label, value }) => (
  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid #f0f0f0' }}>
    <span style={{ fontSize: 13, color: '#888', fontWeight: 500 }}>{label}</span>
    <span style={{ fontSize: 13, color: '#222', fontWeight: 600 }}>{value}</span>
  </div>
);

const Formulario = (props) => {
  const [clients, setClients] = useState();
  const [deudaExigible, setDeudaExigible] = useState([]);
  const [detallePendiente, setDetallePendiente] = useState([]);
  const navigate = useNavigate();

  const getClients = async () => {
    let res;
    if (props.mapa === "PIT") {
      res = await servicioLotes.traersegunmapa2(props.info);
    } else {
      res = await servicioLotes.traersegunmapa1(props.info);
    }
    setClients(res);
    setDeudaExigible(res[1][0]);
    setDetallePendiente(res[1][1]);
  };

  useEffect(() => { getClients(); }, []);

  const tieneDeuda = deudaExigible[0] != 0;

  return (
    <>
      {clients ? (
        <div style={{ padding: '20px 24px 0 24px' }}>

          {/* Sección cliente */}
          <div style={{
            background: '#f8f9fa',
            borderRadius: 10,
            padding: '14px 16px',
            marginBottom: 16,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
              <PersonIcon style={{ fontSize: 18, color: '#0097a7' }} />
              <span style={{ fontWeight: 700, fontSize: 14, color: '#333' }}>Datos del cliente</span>
            </div>
            <InfoRow label="Cliente" value={clients[0].nombrec || '—'} />
            <InfoRow label="Adrema" value={clients[0].adrema || '—'} />
            <InfoRow label="Cuotas totales" value={clients[0].cant_cuotas ?? '—'} />
            <InfoRow label="Liquidadas" value={clients[0].cuotasliq ?? '—'} />

            {props.nivel == 2 && clients[0].nombrec && (
              <button
                onClick={() => window.open("/usuario2/detallecliente/" + clients[0].cuil_cuit)}
                style={{
                  marginTop: 12,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  background: 'none',
                  border: '1.5px solid #0097a7',
                  borderRadius: 7,
                  color: '#0097a7',
                  fontWeight: 600,
                  fontSize: 13,
                  padding: '6px 14px',
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = '#0097a7'; e.currentTarget.style.color = '#fff'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = '#0097a7'; }}
              >
                <OpenInNewIcon style={{ fontSize: 15 }} />
                Ver cliente
              </button>
            )}
          </div>

          {/* Sección cuotas */}
          {tieneDeuda ? (
            <div style={{ marginBottom: 16 }}>
              {[{ title: 'Deuda exigible', rows: deudaExigible }, { title: 'Cuotas pendientes', rows: detallePendiente }].map(({ title, rows }) => (
                <div key={title} style={{ marginBottom: 12 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 6 }}>
                    <ReceiptLongIcon style={{ fontSize: 16, color: '#e53935' }} />
                    <span style={{ fontWeight: 700, fontSize: 13, color: '#333' }}>{title}</span>
                  </div>
                  <div style={{ borderRadius: 8, overflow: 'hidden', border: '1px solid #ececec' }}>
                    <TableContainer>
                      <Table size="small">
                        <TableBody>
                          {rows.map((row, i) => (
                            <TableRow key={i} sx={{ '&:last-child td': { border: 0 } }}>
                              <TableCell sx={{ fontSize: 13, color: '#555' }}>{row.datoa}</TableCell>
                              <TableCell align="right" sx={{ fontSize: 13, fontWeight: 600, color: '#222' }}>
                                {new Intl.NumberFormat('de-DE').format(row.datob)}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{
              display: 'flex', alignItems: 'center', gap: 8,
              background: '#e8f5e9', borderRadius: 8, padding: '10px 14px', marginBottom: 16,
            }}>
              <span style={{ fontSize: 18 }}>✓</span>
              <span style={{ fontSize: 13, fontWeight: 600, color: '#388e3c' }}>Sin cuotas pendientes</span>
            </div>
          )}
        </div>
      ) : (
        <div style={{ padding: 24, textAlign: 'center', color: '#aaa', fontSize: 14 }}>Cargando...</div>
      )}

      {/* Footer */}
      <div style={{
        display: 'flex', justifyContent: 'flex-end',
        padding: '12px 24px 20px',
        borderTop: '1px solid #f0f0f0',
        marginTop: 4,
      }}>
        <button
          onClick={props.cerrar}
          style={{
            background: '#f4f6f8', border: 'none', borderRadius: 8,
            padding: '8px 24px', fontSize: 13, fontWeight: 600,
            color: '#555', cursor: 'pointer',
            transition: 'background 0.15s',
          }}
          onMouseEnter={e => e.currentTarget.style.background = '#e0e0e0'}
          onMouseLeave={e => e.currentTarget.style.background = '#f4f6f8'}
        >
          Cerrar
        </button>
      </div>
    </>
  );
};

export default Formulario;
