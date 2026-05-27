import * as React from 'react';
import { useState, useCallback } from "react";
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Tooltip from "@mui/material/Tooltip";
import { useDropzone } from 'react-dropzone';
import { Box, Typography, alpha } from "@mui/material";

import serviciousuario1 from '../../../services/usuario1';

export default function FormDialog(props) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    id: props.id,
    tipo: '',
    detalle: ''
  });
  const [fileUpload, setFileUpload] = useState(null);
  const [enviarr, setEnviarr] = useState(null);
  const [wordCount, setWordCount] = useState(0);

  const countWords = (text) => {
    const trimmed = text.trim();
    if (trimmed === "") return 0;
    return trimmed.split(/\s+/).length;
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setForm({ id: props.id, tipo: '', detalle: '' });
    setFileUpload(null);
    setEnviarr(null);
    setWordCount(0);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "detalle") {
      if (value.length <= 256) {
        setForm({ ...form, detalle: value });
        setWordCount(countWords(value));
      }
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const onDrop = useCallback((files) => {
    const formData = new FormData();
    formData.append("file", files[0]);
    setFileUpload(files[0]);
    setEnviarr(formData);
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    multiple: false,
    accept: "application/pdf"
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = enviarr || new FormData();
    formData.append("id", form.id);
    formData.append("tipo", form.tipo);
    formData.append("detalle", form.detalle);

    try {
      const rta = await serviciousuario1.derivarpagoic3(formData);
      alert(rta);
      props.getPagosi();
      handleClose();
    } catch (error) {
      console.error(error);
      alert("Ocurrió un error al enviar los datos.");
    }
  };

  return (
    <div>
      <Tooltip title="Clasificar" arrow>
        <Button
          onClick={handleClickOpen}
          variant="contained"
          size="small"
          disableElevation
          sx={{
            px: 1.6,
            borderRadius: 2,
            textTransform: "none",
            fontWeight: 900,
            backgroundColor: "#148D8D",
            boxShadow: "0 10px 20px rgba(20,141,141,0.18)",
            "&:hover": { backgroundColor: "#0f6f6f" },
            transition: "0.2s ease",
            whiteSpace: "nowrap",
            ...(props.sx || {}), // permite que tu tabla le pase estilos
          }}
        >
          Atender
        </Button>
      </Tooltip>


    <Dialog
  open={open}
  onClose={handleClose}
  fullWidth
  maxWidth="sm"
  PaperProps={{
    sx: {
      borderRadius: 4,
      overflow: "hidden",
      background: "rgba(255,255,255,0.94)",
      backdropFilter: "blur(10px)",
      boxShadow: "0 22px 55px rgba(15, 127, 134, 0.18)",
    
    },
  }}
>
  {/* HEADER con gradiente (estilo como tus cards) */}
  <DialogTitle
    sx={{
      px: { xs: 2, md: 3 },
      py: { xs: 2, md: 2.25 },
      background:
        "linear-gradient(90deg, #0a3b4f 0%, #0b4f6c 55%, #0f7f86 100%)",
      color: "#fff",
      fontWeight: 900,
      letterSpacing: 0.2,
      
    }}
  >
    Clasificación del pago
    <Typography sx={{ mt: 0.5, opacity: 0.92, fontWeight: 650, fontSize: 13 }}>
      Cargá el motivo y adjuntá documentación (PDF) si corresponde.
    </Typography>
  </DialogTitle>

  <DialogContent
    sx={{
      p: { xs: 2, md: 3, },
      background:
        "linear-gradient(180deg, rgba(10,59,79,0.05) 0%, rgba(15,127,134,0.04) 50%, rgba(255,255,255,0.94) 100%)",
    }}
  >
    <form onSubmit={handleSubmit}>
      {/* Campo detalle */}
      <TextField
        margin="dense"
        id="detalle"
        name="detalle"
        label="Detalle del motivo"
        placeholder="Ingrese una descripción (máx. 256 caracteres)"
        multiline
        rows={4}
        value={form.detalle}
        onChange={handleChange}
        fullWidth
        inputProps={{ maxLength: 256 }}
        variant="outlined"
        sx={{
          mt: 2.5,
          "& .MuiOutlinedInput-root": {
            borderRadius: 3,
            backgroundColor: "rgba(255,255,255,0.92)",
            boxShadow: "0 10px 24px rgba(1, 86, 124, 0.08)",
            transition: "0.2s ease",
            "& fieldset": {
              borderColor: alpha("#01567c", 0.22),
            },
            "&:hover fieldset": {
              borderColor: alpha("#148D8D", 0.45),
            },
            "&.Mui-focused fieldset": {
              borderColor: "#148D8D",
              borderWidth: 2,
            },
          },
          "& .MuiInputLabel-root": {
            fontWeight: 750,
            color: alpha("#0b2b3a", 0.72),
          },
          "& .MuiInputLabel-root.Mui-focused": {
            color: "#148D8D",
          },
        }}
      />

      {/* Contador */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          mt: 0.75,
          fontSize: "0.85rem",
          fontWeight: 750,
          color: alpha("#0b2b3a", 0.65),
        }}
      >
        Caracteres: {form.detalle.length} / 256
      </Box>

      {/* Dropzone PDF */}
      <Box
        {...getRootProps()}
        sx={{
          mt: 2,
          borderRadius: 3,
          border: `2px dashed ${alpha("#01567c", 0.28)}`,
          background: "rgba(255,255,255,0.85)",
          p: 2,
          textAlign: "center",
          cursor: "pointer",
          transition: "0.2s ease",
          boxShadow: "0 12px 28px rgba(20,141,141,0.10)",
          "&:hover": {
            borderColor: alpha("#148D8D", 0.55),
            transform: "translateY(-1px)",
            boxShadow: "0 16px 34px rgba(20,141,141,0.16)",
          },
          userSelect: "none",
        }}
      >
        <input {...getInputProps()} />

        <Typography sx={{ fontWeight: 900, color: "#01567c" }}>
          {fileUpload ? "PDF listo para enviar" : "Adjuntar documentación (PDF)"}
        </Typography>

        <Typography sx={{ mt: 0.5, fontWeight: 650, color: alpha("#0b2b3a", 0.7) }}>
          {fileUpload ? `Archivo seleccionado: ${fileUpload.name}` : "Arrastrá un PDF acá, o hacé clic para seleccionar"}
        </Typography>

        {/* mini “badge” opcional */}
        {fileUpload && (
          <Box
            sx={{
              mt: 1.2,
              display: "inline-flex",
              alignItems: "center",
              gap: 1,
              px: 1.25,
              py: 0.6,
              borderRadius: 999,
              fontWeight: 900,
              fontSize: 12,
              color: "#0f7f86",
              background: alpha("#148D8D", 0.12),
              border: `1px solid ${alpha("#148D8D", 0.25)}`,
            }}
          >
            Documento adjuntado
          </Box>
        )}
      </Box>

      <DialogActions
        sx={{
          px: 0,
          pt: 2.2,
          display: "flex",
          gap: 1.2,
          justifyContent: "flex-end",
        }}
      >
        <Button
          onClick={handleClose}
          variant="outlined"
          sx={{
            textTransform: "none",
            fontWeight: 900,
            borderRadius: 999,
            px: 2.2,
            borderColor: alpha("#01567c", 0.35),
            color: "#01567c",
            "&:hover": {
              borderColor: alpha("#148D8D", 0.75),
              backgroundColor: alpha("#148D8D", 0.06),
            },
          }}
        >
          Cancelar
        </Button>

        <Button
          type="submit"
          variant="contained"
          disableElevation
          sx={{
            textTransform: "none",
            fontWeight: 900,
            borderRadius: 999,
            px: 2.4,
            color: "#fff",
            background: "linear-gradient(90deg, #01567c 0%, #148D8D 100%)",
            boxShadow: "0 12px 26px rgba(20,141,141,0.22)",
            "&:hover": {
              transform: "translateY(-1px)",
              boxShadow: "0 16px 34px rgba(20,141,141,0.30)",
            },
            transition: "0.2s ease",
          }}
        >
          Confirmar clasificación
        </Button>
      </DialogActions>
    </form>
  </DialogContent>
</Dialog>

    </div>
  );
}
