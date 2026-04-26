import React, { useState } from "react";
import { Snackbar, Alert, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

function Toaster({ message }) {
  const [open, setOpen] = useState(true); // Set to true to show the Snackbar initially

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  return (
    <Snackbar
      open={open}
      autoHideDuration={6000}
      onClose={handleClose}
      anchorOrigin={{ vertical: "top", horizontal: "center" }} // Optional positioning
    >
      <Alert
        onClose={handleClose}
        severity="success"
        sx={{ width: "100%" }}
        action={
          <IconButton
            color="inherit"
            size="small"
            aria-label="close"
            onClick={handleClose}
          >
            <CloseIcon />
          </IconButton>
        }
      >
        {message}
      </Alert>
    </Snackbar>
  );
}

export default Toaster;
