import React, { useState, useCallback } from 'react';
import {
    Button, Dialog, DialogTitle, DialogContent, DialogActions,
    DialogContentText, Select, MenuItem, TextField, CircularProgress, Typography,
} from '@mui/material';
import { useDropzone } from 'react-dropzone';
import serviciocuotas from '../../../services/cuotas';
import servicioUsuario1 from "../../../services/usuario1";
import Modalveronline from '../pagarcuota/verpdfcbu';
import { useParams } from "react-router-dom"

export default function AnticiparCuotas({ id_lote, cuotas, traerr }) {
    const params = useParams();
    const [open, setOpen] = useState(false);
    const [cantidad, setCantidad] = useState(1);
    const [fileUpload, setFileUpload] = useState(null);
    const [enviarr, setEnviarr] = useState(null);
    const [loading, setLoading] = useState(false);
    const [cbus, setCbus] = useState(['']);
    const [pago, setPago] = useState({});
    const [descripcionCBU, setDescripcionCBU] = useState('');

    // Se filtran las cuotas sin calcular (ICC=0)
    const cuotasNoCalculadas = cuotas?.filter(c => c.ICC === 0) || [];
    const maxCuotas = cuotasNoCalculadas.length; // hasta cuántas puede anticipar

    // Filtramos las que tienen valor calculado (>0)
    const cuotasFiltradas = [...cuotas]
        .filter(c => c.cuota_con_ajuste > 0)
        .sort((a, b) => a.numero - b.numero);

    // Tomamos la última cuota calculada (la de mayor número)
    const ultimaCalculada = cuotasFiltradas[cuotasFiltradas.length - 1];

    // Total = cantidad seleccionada * valor de la última cuota calculada
    const totalAnticipado = ultimaCalculada
        ? cantidad * parseFloat(ultimaCalculada.cuota_con_ajuste)
        : 0;

    // --- manejo de archivos
    const onDrop = useCallback((files) => {
        const formData = new FormData();
        formData.append("file", files[0]);
        setFileUpload(files[0]);
        setEnviarr(formData);
    }, []);

    const { getRootProps, getInputProps } = useDropzone({
        onDrop,
        multiple: false,
        accept: "application/pdf, image/*",
    });

    const handleChange = (e) => {
        const selectedCBU = cbus.find((cbu) => cbu.id === e.target.value);
        setPago({ ...pago, [e.target.name]: e.target.value });
        setDescripcionCBU(selectedCBU ? selectedCBU.descripcion : '');
    };

    const traercbu = async () => {
        const cuot = await servicioUsuario1.listacbus(params.cuil_cuit);
        setCbus(cuot);
    };

    const handleEnviar = async () => {
        if (!enviarr) {
            alert("Debe adjuntar un archivo");
            return;
        }

        setLoading(true);
        try {
            const formData = enviarr;
            formData.append("id_lote", id_lote);
            formData.append("cantidad", cantidad);

            const res = await serviciocuotas.anticiparCuotas(formData);
            alert(res?.mensaje || "Anticipación enviada correctamente");
            setOpen(false);
            traerr(id_lote);
        } catch (error) {
            console.error(error);
            alert("Error al enviar la solicitud");
        } finally {
            setLoading(false);
        }
    };

    return (
  <>
    {/* BOTÓN DISPARADOR */}
    <div style={{ display: "flex", justifyContent: "flex-end" }}>
      <Button
        variant="contained"
        sx={{
          mb: 2,
          px: 2.4,
          py: 1.1,
          borderRadius: 2,
          textTransform: "none",
          fontWeight: 800,
          backgroundColor: "#01567c",
          boxShadow: "0 10px 25px rgba(1,86,124,0.25)",
          "&:hover": { backgroundColor: "#014a6b" },
        }}
        onClick={() => {
          setOpen(true);
          traercbu(true);
        }}
        disabled={maxCuotas === 0}
      >
        Anticipar cuotas
      </Button>
    </div>

    {/* MODAL */}
    <Dialog
      open={open}
      onClose={() => setOpen(false)}
      fullWidth
      maxWidth="sm"
      PaperProps={{
        sx: {
          borderRadius: 3,
          overflow: "hidden",
          boxShadow: "0 25px 70px rgba(10,59,79,0.25)",
        },
      }}
    >
      {/* HEADER */}
      <DialogTitle
        sx={{
          color: "#fff",
          fontWeight: 900,
          background:
            "linear-gradient(135deg, #0b2a3a 0%, #01567c 60%, #148D8D 100%)",
          pb: 1.2,
        }}
      >
        Anticipar cuotas
        <Typography sx={{ fontSize: 13, opacity: 0.9, mt: 0.5 }}>
          Seleccioná cantidad, CBU y adjuntá comprobante
        </Typography>
      </DialogTitle>

      <DialogContent sx={{ p: 3 }}>
        {maxCuotas > 0 ? (
          <>
            {/* INFO */}
            <Typography
              sx={{
                fontWeight: 700,
                color: "#0a3b4f",
                mb: 2,
              }}
            >
              Podés anticipar hasta{" "}
              <strong>{maxCuotas}</strong> cuota(s)
            </Typography>

            {/* CANTIDAD */}
            <Select
              value={cantidad}
              onChange={(e) => setCantidad(Number(e.target.value))}
              fullWidth
              sx={{
                mb: 2,
                borderRadius: 2,
                backgroundColor: "#fbfdff",
              }}
            >
              {[...Array(maxCuotas).keys()].map((i) => (
                <MenuItem key={i + 1} value={i + 1}>
                  {i + 1} cuota(s)
                </MenuItem>
              ))}
            </Select>

            {/* RESUMEN */}
            {ultimaCalculada && (
              <div
                style={{
                  marginTop: 12,
                  padding: 16,
                  borderRadius: 12,
                  background: "rgba(20,141,141,0.08)",
                  border: "1px solid rgba(20,141,141,0.25)",
                }}
              >
                <Typography sx={{ fontWeight: 900, fontSize: 16 }}>
                  Total a pagar: $
                  {Number(totalAnticipado).toFixed(2)}
                </Typography>

                <Typography
                  sx={{
                    fontSize: 13,
                    mt: 0.5,
                    color: cantidad >= 30 ? "red" : "rgba(10,59,79,0.75)",
                    fontWeight: cantidad >= 30 ? 800 : 600,
                  }}
                >
                  Incluye {cantidad} cuota(s) · Valor base: $
                  {Number(ultimaCalculada.cuota_con_ajuste).toFixed(2)}
                </Typography>
              </div>
            )}

            {/* CBU */}
            <TextField
              select
              label="Elegir CBU"
              name="cbu"
              onChange={handleChange}
              helperText="Seleccioná el CBU de origen"
              fullWidth
              sx={{
                mt: 3,
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                  backgroundColor: "#fbfdff",
                },
              }}
            >
              {cbus.map((option) => (
                <MenuItem key={option.id} value={option.id}>
                  {option.lazo} - {option.numero}
                </MenuItem>
              ))}
            </TextField>

            {pago.cbu && <Modalveronline id={pago.cbu} />}

            {descripcionCBU && (
              <Typography
                sx={{
                  mt: 1,
                  fontWeight: 700,
                  color: "#0a3b4f",
                }}
              >
                Últimos números: {descripcionCBU}
              </Typography>
            )}

            {/* FECHA */}
            <TextField
              fullWidth
              type="date"
              label="Fecha"
              InputLabelProps={{ shrink: true }}
              onChange={(e) =>
                setPago({ ...pago, fecha: e.target.value })
              }
              sx={{
                mt: 3,
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                  backgroundColor: "#fbfdff",
                },
              }}
            />

            {/* DROPZONE */}
            <div
              {...getRootProps()}
              style={{
                marginTop: 24,
                padding: 22,
                borderRadius: 14,
                border: "2px dashed rgba(1,86,124,0.35)",
                backgroundColor: "rgba(1,86,124,0.04)",
                textAlign: "center",
                cursor: "pointer",
              }}
            >
              <input {...getInputProps()} />
              <Typography sx={{ fontWeight: 700 }}>
                {fileUpload
                  ? `Archivo seleccionado: ${fileUpload.name}`
                  : "Arrastrá un PDF o imagen, o hacé click para seleccionar"}
              </Typography>
            </div>
          </>
        ) : (
          <Typography sx={{ color: "red", fontWeight: 700 }}>
            No hay cuotas disponibles para anticipar.
          </Typography>
        )}
      </DialogContent>

      {/* ACCIONES */}
      <DialogActions
        sx={{
          px: 3,
          py: 2,
          borderTop: "1px solid rgba(1,86,124,0.1)",
        }}
      >
        <Button
          onClick={() => setOpen(false)}
          variant='contained'
           sx={{
            textTransform: "none",
            fontWeight: 900,
            borderRadius: 2,
            backgroundColor: "#148D8D",
            boxShadow: "0 10px 25px rgba(20,141,141,0.25)",
            "&:hover": { backgroundColor: "#0f7a7a" },
          }}
        >
          Cancelar
        </Button>

        <Button
          onClick={handleEnviar}
          variant="contained"
          disabled={maxCuotas === 0 || loading}
          sx={{
            textTransform: "none",
            fontWeight: 900,
            borderRadius: 2,
            backgroundColor: "#01567c",
            boxShadow: "0 10px 25px rgba(20,141,141,0.25)",
            "&:hover": { backgroundColor: "#014666ff" },
          }}
        >
          {loading ? <CircularProgress size={22} /> : "Enviar"}
        </Button>
      </DialogActions>
    </Dialog>
  </>
);
}