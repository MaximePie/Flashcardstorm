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
            score={snackbar.score}
          />
        )}
      </div>
    </>
  );

  // TODO - Create import from Excel feature, the program can take a csv file with 2 columns : Question,Answer 

  function submitAnswer(answer) {
    event.preventDefault();
    server.post(
      'question/submit_answer',
      {id: questions[0].id, is_valid: answer === questions[0].answer}
      ).then(response => {
        let snackbar_text = response.data.text;
        if (response.data.status !== 200) {
          snackbar_text += " Réponses correctes : " + response.data.correct_answer
        }
        setSnackbar({
          is_open: true,
          text: snackbar_text,
          variant: response.data.status === 200 ? 'success' : 'failure',
          score: response.data.status === 200 ? response.data.earned_points : undefined,
        });
        if (response.data.status === 200) {
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

