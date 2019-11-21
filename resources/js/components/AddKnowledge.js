import React from 'react';
import axios from "axios";
import {Button} from '@material-ui/core';
import Snackbar from "./Snackbar";

export default function AddKnowledge() {

  const [form, setForm] = React.useState({
    question: '',
    answer: ''
  });

  const [is_open, setOpen] = React.useState(false);

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
        <Snackbar is_open={is_open} on_close={() => setOpen(false)}/>
      </div>
    </div>
  );

  function updateForm (e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });

    // TODO #11 - Create a new SnackbarComponent
  }

  function submitValues(event) {
    event.preventDefault();
    axios.post('/api/question', form).then(response => {
      setForm({question: '', answer: ''});
      setOpen(true)
    })
  }

}
