import React from 'react';
import axios from "axios";
import Cookies from "js-cookie";
import {useSnackbar} from "notistack";

import TextField from "../molecule/TextField";
import Button from "../molecule/Button";

export default function Login() {

  const [form, setForm] = React.useState({
    email: '',
    password: ''
  });

  const { enqueueSnackbar } = useSnackbar();

  return (
    <div className="Login">
      <form onSubmit={submitValues} className="card LoginForm">
        <h2 className="Title FormTitle">Se connecter</h2>
        <TextField
          value={form.email}
          name="email"
          onChange={updateForm}
          variant="big"
          placeholder="E-mail"
        />
        <TextField
          value={form.password}
          name="password"
          onChange={updateForm}
          placeholder="Mot de passe"
          type="password"
          variant="big"
        />
        <Button
          text="Se connecter"
          onClick={submitValues}
          variant="big"
        />
      </form>
    </div>
  );


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