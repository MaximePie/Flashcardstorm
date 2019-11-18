import React from 'react';
import axios from "axios";
import {Button, Icon, IconButton, Snackbar, SnackbarContent} from '@material-ui/core';
export default function AddKnowledge() {

  const [form, setForm] = React.useState({
    question: '',
    answer: ''
  });

  const [open, setOpen] = React.useState(false);

  return (
    <div className="container">
      <div className="row justify-content-center">
        <form onSubmit={submitValues}>
          <label>
            Question
            <input
              value={form.question}
              name="question"
              onChange={updateForm}
            />
          </label>
          <br />
          <label>
            Answer
            <input
              value={form.answer}
              name="answer"
              onChange={updateForm}
            />
          </label>
          <br />
          <Button variant="outlined" onClick={submitValues}>
            Open success snackbar
          </Button>
          </form>

        <Snackbar
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          open={open}
          autoHideDuration={6000}
          onClose={() => setOpen(false)}
        >
          <SnackbarContent
          aria-describedby="client-snackbar"
          message={
            <span id="client-snackbar">
              Succès !
            </span>
          }
          action={[
            <IconButton key="close" aria-label="close" color="inherit" onClick={() => setOpen(false)}>
              X
            </IconButton>,
          ]}
        />
        </Snackbar>
      </div>
    </div>
  );

  function updateForm (e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });

    // TODO - Create new SnackbarComponent
  }

  function submitValues(event) {
    event.preventDefault();
    axios.post('/api/question', form).then(response => {
      setForm({question: '', answer: ''});
      setOpen(true)
    })
  }

}
