import React from 'react';
import Button from "./Button";
import TextField from "@material-ui/core/TextField";
import server from "../server";
import {useSnackbar} from "notistack";

export default function AddKnowledge() {

  const [form, setForm] = React.useState({
    question: '',
    answer: ''
  });

  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

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
          <Button text="Enregistrer la question" onClick={submitValues}/>
        </form>
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
    server.post('question', form).then(response => {
      setForm({question: '', answer: ''});

      enqueueSnackbar("Success"
        ,
        {
          anchorOrigin: {
            vertical: 'top',
            horizontal: 'center',
          },
          variant: 'success',
        }
      );
    })
  }

}
