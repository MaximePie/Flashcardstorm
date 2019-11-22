import React from 'react';
import axios from "axios";
import Button from "./Button";
import Snackbar from "./Snackbar";
import TextField from "@material-ui/core/TextField";

export default function AddKnowledge() {

  const [form, setForm] = React.useState({
    question: '',
    answer: ''
  });

  const [is_open, setOpen] = React.useState(false);

  return (
    <div className="Addknowledge">
      <div className="jumbotron Addknowledge__title">
        <h1>Ajouter une question</h1>
      </div>
      <div className="row justify-content-center">
        <form onSubmit={submitValues} className="Addknowledge__form card">
          <TextField
            value={form.question}
            name="question"
            onChange={updateForm}
            label="Question"
          />
          <TextField
            value={form.answer}
            name="answer"
            onChange={updateForm}
            label="Réponse"
          />
          <Button  text="Enregistrer la question" onClick={submitValues}/>
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
