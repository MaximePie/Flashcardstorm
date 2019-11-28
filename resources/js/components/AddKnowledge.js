import React from 'react';
import Button from "./Button";
import TextField from "@material-ui/core/TextField";
import server from "../server";
import {useSnackbar} from "notistack";
import Radio from "@material-ui/core/Radio";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import RadioGroup from "@material-ui/core/RadioGroup";

export default function AddKnowledge() {

  const [form, setForm] = React.useState({
    question: '',
    answer: ''
  });

  const [categories, updateCategories] = React.useState(undefined);
  const [selectedCategory, setSelectedCategory] = React.useState(0);

  React.useEffect(() => {
    updateCategoriesList()
  }, []);

  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  return (
    <div className="Addknowledge">
      <div className="jumbotron Addknowledge__title">
        <h1>Ajouter une question</h1>
      </div>
      <div className="row justify-content-center">
        <form onSubmit={submitValues} className="Addknowledge__form card">
          <RadioGroup className="Addknowledge__radiogroup" aria-label="Catégorie" name="category" value={selectedCategory} onChange={handleSelection}>
            <FormControlLabel value={0} control={<Radio/>} label="Sans catégorie" />
            {categories && categories.map(function(category) {
              return (
                <FormControlLabel key={"category-" + category.id} value={category.id} control={<Radio/>} label={category.name} />
              )
            })}
          </RadioGroup>
          <TextField
            value={form.question}
            name="question"
            onChange={updateForm}
            label="Question"
          />
          <TextField
            value={form.answer}
            name="answer"
            onChange={updateForm}
            label="Réponse"
          />
          <Button text="Enregistrer la question" onClick={submitValues}/>
        </form>
      </div>
    </div>
  );

  function handleSelection(event) {
    setSelectedCategory(parseInt(event.target.value, 10))
  }

  function updateForm (e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });

    // TODO #11 - Create a new SnackbarComponent
  }

  function submitValues(event) {
    event.preventDefault();
    server.post('question', {question: form.question, answer: form.answer, category: selectedCategory}).then(response => {
      setForm({question: '', answer: ''});
      enqueueSnackbar("Success"
        ,
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

  function updateCategoriesList() {
    server.get('categories').then(response => {
      updateCategories(response.data.categories)
    })
  }
}
