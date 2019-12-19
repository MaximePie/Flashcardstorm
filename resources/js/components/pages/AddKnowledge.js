import React, {useCallback} from 'react';
import Button from "../molecule/Button";
import TextField from "@material-ui/core/TextField";
import server from "../../server";
import {useSnackbar} from "notistack";
import Radio from "@material-ui/core/Radio";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import RadioGroup from "@material-ui/core/RadioGroup";
import {useDropzone} from "react-dropzone";

import csv from 'csv';

export default function AddKnowledge(props) {

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

  // CSV management
  const onDrop = useCallback(acceptedFiles => {
    const reader = new FileReader();
    reader.onload = () => {
      csv.parse(reader.result, (err, data) => {
        if (err) {
          enqueueSnackbar('Aïe aïe aïe ! Il y a eu une erreur lors de l\'import ! Appuyez sur F12 et consultez la console pour en savoir plus !',
            {
              anchorOrigin: {
                vertical: 'top',
                horizontal: 'center',
              },
              variant: 'error',
            })
        }
        else {
          importQuestions(data);
        }
      });
    };

    reader.readAsText(acceptedFiles[0]);
  }, []);
  const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop})

  return (
    <div className="Addknowledge">
      <div className="jumbotron Addknowledge__title">
        <h1>Ajouter une question</h1>
        {props.is_connected &&  (
          <div {...getRootProps()} className="Addknowledge__import-drop-zone">
            <input {...getInputProps()}/>
            {
              isDragActive ?
                <p>Drop the files here ...</p> :
                <p>Drag 'n' drop some files here, or click to select files</p>
            }
          </div>
        )}
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
  }

  function submitValues(event) {
    event.preventDefault();
    server.post('question', {question: form.question, answer: form.answer, category: selectedCategory}).then(response => {
      setForm({question: '', answer: ''});
      enqueueSnackbar("La question a bien été ajoutée !",
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

  /**
   * Send the imported JSON questions from csv file
   * Json data: the questions we want to import
   */
  function importQuestions(questions) {
    server.post('question_import', {questions}).then(() => {
      enqueueSnackbar("Les questions ont bien été importées !",
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
}
