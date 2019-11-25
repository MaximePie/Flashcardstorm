import React from 'react';
import TextField from "@material-ui/core/TextField";
import axios from "axios";
import Button from "./Button";

export default function Register() {

  const [form, setForm] = React.useState({
    name: '',
    email: '',
    password: ''
  });

  return (
    <div className="container">
      <form onSubmit={submitValues} className="card">
        <TextField
          value={form.name}
          name="name"
          onChange={updateForm}
          label="Pseudo"
        />
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
        />
        <Button  text="S'enregistrer" onClick={submitValues}/>
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
    axios.post('/api/register', form).then(response => {
      alert("Le compte a bien été créé")
    })
  }
}
