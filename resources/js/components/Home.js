import React from 'react';
import axios from "axios";
import QuestionCard from "./QuestionCard";
import Snackbar from "./Snackbar";

export default function Home() {

  const [questions, updateQuestions] = React.useState(undefined);

  const [is_open, setOpen] = React.useState(false);

  React.useEffect(() => {
    updateQuestionsBag()
    // TODO Créer une méthode updateUserInfo pour récupérer les infos (dont le score)
  }, []);

  return (
    // TODO Afficher tous les composants sur la même page Home.js pour le moment puisqu'on n'a que très peu de contenu*
    <>
      <div className="jumbotron Home__title">
        <h1>Bienvenue sur FlashcardStorm</h1>
        <p>Make learning great again !</p>
      </div>
      <div className="container Home">
        <div className="row">
          {questions && (
            <QuestionCard question={questions[0]} onSubmit={submitAnswer}/>
          )}
        </div>
        <Snackbar is_open={is_open} on_close={() => setOpen(false)}/>
      </div>
    </>
  );

  // TODO - Create import from Excel feature, the program can take a csv file with 2 columns : Question,Answer 

  function submitAnswer(answer) {
    // TODO #20 - Send answer info
    axios.post('/api/question/submit_answer', {
      id: questions[0].id,
      is_valid: answer === questions[0].answer,
    }).then(response => {
      setOpen(true)
    })
    // TODO - Fetch a new question and remove current question

    // TODO #13 - Display the score sent by the Backoffice
  }

  function updateQuestionsBag() {
    axios.get('api/question').then(response => {
      updateQuestions(response.data)
    })
  }
}

