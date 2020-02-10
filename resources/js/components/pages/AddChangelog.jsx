import React from 'react';
import TextField from '@material-ui/core/TextField';
import { useSnackbar } from 'notistack';
import Button from '../molecule/Button';
import server from '../../server';

export default function AddChangelog() {
  const [form, setForm] = React.useState({
    title: '',
    text: '',
    nextstep: '',
  });

  const { enqueueSnackbar } = useSnackbar();

  return (
    <div className="container AddChangelog">
      <form className="AddChangelog__form card" onSubmit={submitValues}>
        <TextField
          value={form.title}
          name="title"
          onChange={updateForm}
          label="title"
          multiline
          classes={{ root: 'AddChangelog__field' }}
        />
        <TextField
          value={form.text}
          name="text"
          onChange={updateForm}
          label="text"
          multiline
          classes={{ root: 'AddChangelog__field' }}
        />
        <TextField
          value={form.nextstep}
          name="nextstep"
          onChange={updateForm}
          label="nextstep"
          multiline
          classes={{ root: 'AddChangelog__field' }}
        />
        <Button text="Enregistrer le changelog" onClick={submitValues} />
      </form>
    </div>
  );

  function updateForm(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }


  function submitValues(event) {
    event.preventDefault();
    server.post('changelog', form).then(() => {
      setForm({
        title: '',
        text: '',
        nextstep: '',
      });
      enqueueSnackbar('Le changelog a bien été ajoutée !',
        {
          anchorOrigin: {
            vertical: 'top',
            horizontal: 'center',
          },
          variant: 'success',
        });
    });
  }
}
