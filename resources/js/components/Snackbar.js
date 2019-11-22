import React from 'react';
import {IconButton, Snackbar, SnackbarContent} from '@material-ui/core';
export default function AddKnowledge(props) {

  return (
      <Snackbar
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
              Succès !
            </span>
          }
          action={[
            <IconButton key="close" aria-label="close" color="inherit" onClick={props.on_close}>
              X
            </IconButton>,
          ]}
        />
      </Snackbar>
    )
}