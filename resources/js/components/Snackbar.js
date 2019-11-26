import React from 'react';
import {IconButton, Snackbar as MaterialSnackbar, SnackbarContent} from '@material-ui/core';

export default function Snackbar(props) {

  let text = props.text || "Succès !";
  let variant = "success";

  if (props.variant) {
    variant = props.variant;
  }

  return (
      <MaterialSnackbar
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        open={props.is_open}
        autoHideDuration={100}
        onClose={props.onClose}
      >
        <SnackbarContent
          aria-describedby="client-snackbar"
          classes={{
            root: "Snackbar-" + variant
          }}
          message={
            <div className="Snackbar__message">
              <span id="client-snackbar">
                {text}
              </span>
              {props.score && (
                <span className="Snackbar__score" id="client-snackbar">
                  +{props.score}
                </span>
              )}
            </div>
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