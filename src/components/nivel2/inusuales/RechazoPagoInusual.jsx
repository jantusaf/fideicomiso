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
import { Box, Typography } from "@mui/material";
import { COLOR_TEXT, COLOR_ACCENT, COLOR_MUTED, COLOR_OK, sxBtnPrimary, sxBtnOutlined, slotPropsDialog, sxDialogTitle, sxDialogActions } from "./../detalleclienteIngresos/estilos";

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
          variant="outlined"
          size="small"
          sx={{ ...sxBtnOutlined, px: 1.75, whiteSpace: "nowrap", ...(props.sx || {}) }}
        >
          Atender
        </Button>
      </Tooltip>

      <Dialog
        open={open}
        onClose={handleClose}
        fullWidth
        maxWidth="sm"
        slotProps={slotPropsDialog}
      >
        <DialogTitle sx={sxDialogTitle}>
          Clasificación del pago
          <Typography sx={{ mt: 0.5, color: COLOR_MUTED, fontWeight: 500, fontSize: 13 }}>
            Cargá el motivo y adjuntá documentación (PDF) si corresponde.
          </Typography>
        </DialogTitle>

        <form onSubmit={handleSubmit}>
          <DialogContent sx={{ px: 3, py: 2 }}>
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
              slotProps={{ htmlInput: { maxLength: 256 } }}
              variant="outlined"
              sx={{ mt: 1.5, "& .MuiOutlinedInput-root": { borderRadius: 1.5 } }}
            />

            <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 0.75, fontSize: 12.5, color: COLOR_MUTED }}>
              Caracteres: {form.detalle.length} / 256
            </Box>

            {/* Dropzone PDF */}
            <Box
              {...getRootProps()}
              sx={{
                mt: 2,
                borderRadius: 2,
                border: `1px dashed #b7c2c9`,
                backgroundColor: "#f9fafb",
                p: 2.25,
                textAlign: "center",
                cursor: "pointer",
                transition: "border-color .15s ease, background-color .15s ease",
                "&:hover": { borderColor: COLOR_ACCENT, backgroundColor: "#f4f7f8" },
                userSelect: "none",
              }}
            >
              <input {...getInputProps()} />

              <Typography sx={{ fontWeight: 600, fontSize: 14, color: COLOR_TEXT }}>
                {fileUpload ? "PDF listo para enviar" : "Adjuntar documentación (PDF)"}
              </Typography>

              <Typography sx={{ mt: 0.5, fontSize: 13, color: COLOR_MUTED }}>
                {fileUpload
                  ? `Archivo seleccionado: ${fileUpload.name}`
                  : "Arrastrá un PDF acá, o hacé clic para seleccionar"}
              </Typography>

              {fileUpload && (
                <Box
                  sx={{
                    mt: 1.25,
                    display: "inline-flex",
                    alignItems: "center",
                    px: 1.25,
                    py: 0.4,
                    borderRadius: 999,
                    fontWeight: 600,
                    fontSize: 12,
                    color: COLOR_OK,
                    border: `1px solid ${COLOR_OK}`,
                  }}
                >
                  Documento adjuntado
                </Box>
              )}
            </Box>
          </DialogContent>

          <DialogActions sx={sxDialogActions}>
            <Button onClick={handleClose} variant="outlined" sx={sxBtnOutlined}>
              Cancelar
            </Button>

            <Button type="submit" variant="contained" disableElevation sx={sxBtnPrimary}>
              Confirmar clasificación
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </div>
  );
}
