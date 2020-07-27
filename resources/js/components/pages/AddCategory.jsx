import React from 'react';
import TextField from '@material-ui/core/TextField';
import { useSnackbar } from 'notistack';
import { SketchPicker } from 'react-color';
import Button from '../atom/Button';
import server from '../../server';
import QuestionCard from '../molecule/QuestionCard';

export default function AddChangelog() {
  const [form, setForm] = React.useState({
    color: '',
    icon: '',
    name: '',
  });

  const { enqueueSnackbar } = useSnackbar();
  const isFormValid = !!form.color.length && !!form.icon.length && !!form.name.length;

  return (
    <div className="container AddCategory">
      <form className="AddCategory__form card" onSubmit={submitValues}>
        <TextField
          value={form.name}
          name="name"
          onChange={updateForm}
          label="Nom de catégorie"
          multiline
          classes={{ root: 'AddCategory__field' }}
        />
        <div className="AddCategory__field">
          <TextField
            value={form.icon}
            name="icon"
            onChange={updateForm}
            label="Icône"
            multiline
          />
        </div>
        <a href="https://fontawesome.com/cheatsheet/free/solid">Liste des icônes</a>
        <div className="AddCategory__field">
          <SketchPicker color={form.color} onChangeComplete={updateFormColor} />
        </div>
        <Button text="Enregistrer la catégorie" onClick={submitValues} isDisabled={!isFormValid} />
      </form>
      <div className="AddCategory__preview card">
        {isFormValid && (
          <QuestionCard
            isDemo
            question={{
              wording: 'Question d\'exemple',
              category: {
                name: form.name,
                icon: form.icon,
                color: form.color,
              },
            }}
          />
        )}
      </div>
    </div>
  );

  function updateForm(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  function updateFormColor(color) {
    setForm({
      ...form,
      color: color.hex,
    });
  }


  function submitValues(event) {
    event.preventDefault();
    server.post('category', form)
      .then(() => {
        setForm({
          color: '',
          icon: '',
          name: '',
        });
        enqueueSnackbar('La catégorie a bien été ajoutée !',
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
