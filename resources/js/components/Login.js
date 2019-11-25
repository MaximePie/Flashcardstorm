import React from 'react';
import TextField from "@material-ui/core/TextField";
import axios from "axios";
import Button from "./Button";

export default function Login(props) {

  const [form, setForm] = React.useState({
    email: '',
    password: ''
  });


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
        />
        <Button  text="S'enregistrer" onClick={submitValues}/>
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
    axios.post('/api/login', form).then(response => {
      console.log(response);
      if(response.status === 200) {
        document.location = "/home";
      }
    })
  }
}