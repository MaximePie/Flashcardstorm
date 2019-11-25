import React from 'react';
import {IconButton, Snackbar as MaterialSnackbar, SnackbarContent} from '@material-ui/core';

export default function Snackbar(props) {

  let text = props.text || "Succès !";

  return (
      <MaterialSnackbar
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        open={props.is_open}
        autoHideDuration={3000}
        onClose={props.onClose}
      >
        <SnackbarContent
          aria-describedby="client-snackbar"
          message={
            <span id="client-snackbar">
              {text}
            </span>
          }
          action={[
            <IconButton key="close" aria-label="close" color="inherit" onClick={props.on_close}>
              X
            </IconButton>,
          ]}
        />
      </MaterialSnackbar>
    )
}