import React from 'react';
import TextField from '@material-ui/core/TextField';
import { useSnackbar } from 'notistack';
import { Tooltip } from '@material-ui/core';
import Button from '../molecule/Button';
import server from '../../server';
import Icon from '../Icon';

export default function AddChangelog() {
  const [form, setForm] = React.useState({
    title: '',
    text: '',
  });

  const { enqueueSnackbar } = useSnackbar();

  return (
    <div className="AddChangelog">
      <form className="AddChangelog__form card" onSubmit={submitValues}>
        <h2>
          Proposez votre idée !
          <Tooltip
            title={"Ici vous pouvez proposer des nouvelles fonctionnalités pour améliorer l'application, veillez à "
            + 'être le plus précis possible, cette fonctionnalité sera élue parmi les fonctionnalités potentielles !'}
            placement="top"
          >
            <span>
              <Icon className="Icon--hint" name="question-circle" />
            </span>
          </Tooltip>
        </h2>
        <TextField
          value={form.title}
          name="title"
          onChange={updateForm}
          label="Nom de la fonctionnalité"
          multiline
          classes={{ root: 'AddChangelog__field' }}
        />
        <TextField
          value={form.text}
          name="text"
          onChange={updateForm}
          label="Détails"
          multiline
          classes={{ root: 'AddChangelog__field' }}
        />
        <Button text="Enregistrer la proposition" onClick={submitValues} />
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
    const isValid = confirm('Attention, cette fonctionnalité sera visible de tous, et peut-être intégrée, veillez à ce qu\'elle ne soit offensante pour personne ! C\'est OK ?');
    if (isValid) {
      server.post('changelog', form)
        .then(() => {
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
}
