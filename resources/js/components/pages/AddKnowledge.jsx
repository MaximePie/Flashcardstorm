import React, { useCallback } from 'react';
import TextField from '@material-ui/core/TextField';
import { useSnackbar } from 'notistack';
import Radio from '@material-ui/core/Radio';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import RadioGroup from '@material-ui/core/RadioGroup';
import { useDropzone } from 'react-dropzone';

import csv from 'csv';
import { Checkbox } from '@material-ui/core';
import server from '../../server';
import Button from '../atom/Button';
import { isMobile } from '../../helper';

export default function AddKnowledge() {
  const [form, setForm] = React.useState({
    question: '',
    answer: '',
    shouldHaveReverseQuestion: false,
    additionalAnswers: [],
  });

  const [fieldsAmount, setFieldsAmount] = React.useState(0);
  const [categories, updateCategories] = React.useState(undefined);
  const [image, setImage] = React.useState(undefined);
  const [selectedCategory, setSelectedCategory] = React.useState(0);

  React.useEffect(() => {
    updateCategoriesList();
  }, []);

  const { enqueueSnackbar } = useSnackbar();

  const additionalTextFields = [];

  for (let i = 0; i < fieldsAmount; i += 1) {
    additionalTextFields.push(
      <TextField
        key={`additionalAnswers-${i}`}
        value={form.additionalAnswers[i] || ''}
        name={`additionalAnswers-${i}`}
        onChange={(event) => updateForm(event, i)}
        label="Réponse additionelle"
      />,
    );
  }

  // CSV management
  const onDrop = useCallback((acceptedFiles) => {
    const reader = new FileReader();
    reader.onload = () => {
      console.log(reader.result);
      csv.parse(reader.result, (err, data) => {
        if (err) {
          console.log(err);
          console.log(data);
          // eslint-disable-next-line max-len
          enqueueSnackbar('Aïe aïe aïe ! Il y a eu une erreur lors de l\'import ! Appuyez sur F12 et consultez la console pour en savoir plus !',
            {
              anchorOrigin: {
                vertical: 'top',
                horizontal: 'center',
              },
              variant: 'error',
            });
        } else {
          importQuestions(data);
        }
      });
    };

    reader.readAsText(acceptedFiles[0]);
  }, []);
  const { getRootProps } = useDropzone({ onDrop });

  return (
    <div className="Addknowledge">
      <div className="Addknowledge__title">
        <h1>Ajouter des questions</h1>
      </div>
      <div className="row justify-content-center Addknowledge__body">
        <form onSubmit={submitValues} className="Addknowledge__form card">
          <Button onClick={addField} text="+" />
          <div className="Addknowledge__fields">
            <div className="Addknowledge__fields-top">
              {!image && (
                <TextField
                  value={form.question}
                  name="question"
                  onChange={updateForm}
                  label="Question"
                />
              )}
              <div className="Addknowledge__file-input-group">
                <input
                  type="file"
                  className="Addknowledge__file-input"
                  onChange={handleImageUpload}
                />
                <i className="fas fa-image Addknowledge__fields-top-image Addknowledge__file-input-button" />
                {image && image.size < 1000000 && 'L\'image est prête'}
                {image && image.size > 1000000 && 'L\'image est trop lourde, 1Mo max'}
              </div>
            </div>
            <TextField
              value={form.answer}
              name="answer"
              onChange={updateForm}
              label="Réponse"
            />
            {additionalTextFields}
          </div>
          <RadioGroup
            className="Addknowledge__radiogroup"
            aria-label="Catégorie"
            name="category"
            value={selectedCategory}
            onChange={handleSelection}
          >
            <FormControlLabel value={0} control={<Radio />} label="Sans catégorie" />
            {categories && categories.map((category) => (
              <FormControlLabel
                key={`category-${category.id}`}
                value={category.id}
                control={<Radio />}
                label={category.name}
              />
            ))}
          </RadioGroup>
          {!image && (
            <div className="Addknowledge__reverseQuestionCheckbox">
              <Checkbox
                checked={form.shouldHaveReverseQuestion}
                onChange={(event) => setForm({
                  ...form,
                  shouldHaveReverseQuestion: event.target.checked,
                })}
              />
              <span>
                Créer une question inverse
              </span>
            </div>
          )}
          <Button text="Enregistrer la question" onClick={submitValues} isDisabled={image && image.size > 1000000} />
        </form>
      </div>
    </div>
  );

  /**
   * Set the wanted category for the question
   * @param event MouseClick event to provide category info
   */
  function handleSelection(event) {
    setSelectedCategory(parseInt(event.target.value, 10));
  }

  /**
   * Add a text field for additionalAnswers
   */
  function addField() {
    setFieldsAmount(fieldsAmount + 1);
  }

  /**
   * Set the appropriate image data on upload
   */
  function handleImageUpload(event) {
    const { files } = event.target;
    if (!files.length) return;
    setImage(files[0]);
  }

  function updateForm(e, index) {
    if (index !== undefined) {
      const additionalAnswers = [...form.additionalAnswers];
      additionalAnswers[index] = e.target.value;
      setForm({
        ...form,
        additionalAnswers,
      });
    } else {
      setForm({
        ...form,
        [e.target.name]: e.target.value,
      });
    }
  }

  function submitValues(event) {
    event.preventDefault();

    let additionnalAnswers = '';
    const explodedAdditionnalAnswers = [...form.additionalAnswers];
    for (let i = 0; i < explodedAdditionnalAnswers.length; i += 1) {
      additionnalAnswers += `${explodedAdditionnalAnswers[i]},`;
    }

    console.log(image);
    console.log(form.question);

    // Sending main question data
    server.post('question',
      {
        question: !image ? form.question : '',
        answer: form.answer,
        category: selectedCategory,
        shouldHaveReverseQuestion: form.shouldHaveReverseQuestion,
        additionalAnswers: additionnalAnswers,
      })
      .then((response) => { // Sending image
        if (image) {
          const imageFormData = new FormData();
          imageFormData.append('image', image);
          imageFormData.append('question_id', response.data.Question.id);
          server.post('addImageToQuestion', imageFormData)
            .then(() => {
              setImage(undefined);
            });
        }

        setForm({
          ...form,
          question: '',
          answer: '',
        });
        setFieldsAmount(0);
        enqueueSnackbar('La question a bien été ajoutée !',
          {
            anchorOrigin: {
              vertical: 'top',
              horizontal: 'center',
            },
            variant: 'success',
          });
      });
  }

  function updateCategoriesList() {
    server.get('categories')
      .then((response) => {
        updateCategories(response.data.categories);
      });
  }

  /**
   * Send the imported JSON questions from csv file
   * Json data: the questions we want to import
   */
  function importQuestions(questions) {
    server.post('question_import', { questions })
      .then(() => {
        enqueueSnackbar('Les questions ont bien été importées !',
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
