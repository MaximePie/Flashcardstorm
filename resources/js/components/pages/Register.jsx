import React from 'react';
import axios from "axios";
import {useSnackbar} from "notistack";

import Button from "../molecule/Button";
import TextField from "../molecule/TextField";

export default function Register() {

  const [form, setForm] = React.useState({
    name: '',
    email: '',
    password: ''
  });

  const { enqueueSnackbar } = useSnackbar();

  return (
    <div className="Register">
      <form onSubmit={submitValues} className="card RegisterForm">
      <h2 className="Title FormTitle">S'inscrire</h2>
        <TextField
          value={form.name}
          name="name"
          onChange={updateForm}
          variant="big"
          placeholder="Pseudo"
        />
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
          text="S'enregistrer"
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
    axios.post('/api/register', form).then(() => {
      enqueueSnackbar("L'enregistrement s'est bien passé, bienvenue !", {variant: "success", anchorOrigin: {
          vertical: 'top',
          horizontal: 'center',
        }});
      props.history.push('/login');
    })
  }
}
