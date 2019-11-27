import React from 'react';
import TextField from "@material-ui/core/TextField";
import axios from "axios";
import Button from "./Button";
import Cookies from "js-cookie";
import {useSnackbar} from "notistack";

export default function Login(props) {

  const [form, setForm] = React.useState({
    email: '',
    password: ''
  });

  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  return (
    <div className="container">
      <form onSubmit={submitValues} className="card">
        <TextField
          value={form.email}
          name="email"
          onChange={updateForm}
          label="E-mail"
        />
        <TextField
          value={form.password}
          name="password"
          onChange={updateForm}
          label="Mot de passe"
          type="password"
        />
        <Button text="S'enregistrer" onClick={submitValues}/>
      </form>
    </div>
  )


  function updateForm (e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  }

  function submitValues(event) {
    event.preventDefault();
    axios.post('/login', form).then(response => {
      if(response.data.status && response.data.status !== 200) {
        enqueueSnackbar('Informations incorrectes', {variant: "error", anchorOrigin: {
            vertical: 'top',
            horizontal: 'center',
          },})
      }
      else {
        Cookies.set('Bearer', response.data.bearer);
        document.location = "/home";
      }
    })
  }
}