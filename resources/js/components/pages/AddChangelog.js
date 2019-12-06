import React from 'react';
import TextField from "@material-ui/core/TextField";
import Button from "../Button";
import server from "../../server";
import {useSnackbar} from "notistack";

export default function AddChangelog() {

  const [form, setForm] = React.useState({
    title: '',
    text: '',
    nextstep: '',
  });

  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  return (
    <div className="container">
      <form onSubmit={submitValues}>
        <TextField
          value={form.title}
          name="title"
          onChange={updateForm}
          label="title"
          multiline
        />
        <TextField
          value={form.text}
          name="text"
          onChange={updateForm}
          label="text"
          multiline
        />
        <TextField
          value={form.nextstep}
          name="nextstep"
          onChange={updateForm}
          label="nextstep"
          multiline
        />
        <Button text="Enregistrer le changelog" onClick={submitValues}/>
      </form>
    </div>
  );

  function updateForm(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  }


  function submitValues(event) {
    event.preventDefault();
    server.post('changelog', form).then(response => {
      setForm({
        title: '',
        text: '',
        nextstep: '',
      });
      enqueueSnackbar("Le changelog a bien été ajoutée !",
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

