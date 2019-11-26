import React from 'react';
import TextField from "@material-ui/core/TextField";
import axios from "axios";
import Button from "./Button";
import Cookies from "js-cookie";
import Snackbar from "./Snackbar";

export default function Login(props) {

  const [form, setForm] = React.useState({
    email: '',
    password: ''
  });

  const [is_open, setOpen] = React.useState(false);

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
      <Snackbar variant="danger" text="Informations incorrectes" is_open={is_open} on_close={() => setOpen(false)}/>
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
        setOpen(true);
      }
      else {
        Cookies.set('Bearer', response.data.bearer);
        document.location = "/home";
      }
    })
  }
}