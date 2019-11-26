import React from 'react';
import axios from "axios";
import QuestionCard from "./QuestionCard";
import Snackbar from "./Snackbar";
import server from '../server'

export default function Home(props) {
  const [questions, updateQuestions] = React.useState(undefined);

  const [snackbar, setSnackbar] = React.useState(undefined);

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
            <QuestionCard question={questions[0] || undefined} onSubmit={submitAnswer}/>
          )}
        </div>
        {snackbar && (
          <Snackbar
            variant={snackbar.variant}
            is_open={snackbar.is_open}
            on_close={() => setSnackbar({...snackbar, is_open: false})}
            text={snackbar.text}
          />
        )}
      </div>
    </>
  );

  // TODO - Create import from Excel feature, the program can take a csv file with 2 columns : Question,Answer 

  function submitAnswer(answer) {
    // TODO #20 - Send answer info
    server.post(
      '/question/submit_answer',
      {id: questions[0].id, is_valid: answer === questions[0].answer}
      ).then(response => {
      setSnackbar({
        is_open: true,
        text: response.data.text,
        variant: response.data.status === 200 ? 'success' : 'failure',
      });
      if(response.data.status === 200) {
        props.updateUserScore();
      }
      updateQuestionsBag();
    });
    // TODO #13 - Display the score sent by the Backoffice
  }

  function updateQuestionsBag() {
    axios.get('api/question').then(response => {
      updateQuestions(response.data)
    })
  }
}

