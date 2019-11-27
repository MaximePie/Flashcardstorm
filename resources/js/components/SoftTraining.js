import React from 'react';
import axios from "axios";
import QuestionCard from "./QuestionCard";
import server from '../server'
import {useSnackbar} from "notistack";

export default function SoftTraining(props) {
  const [question, updateQuestions] = React.useState(undefined);
  const [questionCardMessage, updateQuestionCardMessage] = React.useState(undefined);

  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  React.useEffect(() => {
    updateQuestionsBag()
    // TODO Créer une méthode updateUserInfo pour récupérer les infos (dont le score)
  }, []);

  return (
    // TODO Afficher tous les composants sur la même page Home.js pour le moment puisqu'on n'a que très peu de contenu*
    <>
      <div className="jumbotron Home__title">
        <h1>Mode consolidation</h1>
        <p>Répondez aux questions en fonction du temps passé pour consolider vos mémorisations</p>
        <p>Seules les questions auxquelles vous n'avez pas répondu depuis assez longtemps apparaîtront</p>
      </div>
      <div className="container Home">
        <div className="row">
          {question && (
            <QuestionCard
              question={question || undefined}
              onSubmit={submitAnswer}
              onSkip={() => updateQuestionsBag()}
              message={questionCardMessage}
            />
          )}
          {!question && (
            <div>
              {questionCardMessage}
            </div>
          )}
        </div>
      </div>
    </>
  );

  // TODO - Create import from Excel feature, the program can take a csv file with 2 columns : Question,Answer

  function submitAnswer(answer) {
    event.preventDefault();
    server.post(
      'question/submit_answer',
      {
        id: question.id,
        is_valid: answer === question.answer,
        mode: "soft",
        is_golden_card: question.is_golden_card,
      }
    ).then(response => {
      let snackbar_text = response.data.text;
      if (response.data.status !== 200) {
        snackbar_text += " Réponses correctes : " + response.data.correct_answer
      }

      let score = response.data.status === 200 && response.data.earned_points > 0 ? response.data.earned_points : undefined

      enqueueSnackbar(
        <div className="Home__snackbar">
          {snackbar_text}
          {score && (
            <span className="Home__snackbar-score">
                +{score}
              </span>
          )}
        </div>
        ,
        {
          anchorOrigin: {
            vertical: 'top',
            horizontal: 'center',
          },
          variant: response.data.status === 200 ? 'success' : 'warning',
        }
      );

      if (response.data.status === 200) {
        props.updateUserScore();
      }
      updateQuestionsBag();
    });
  }

  function updateQuestionsBag() {
    server.get('question/soft').then(response => {
      updateQuestions(response.data.question || undefined);
      updateQuestionCardMessage(response.data.message);
    })
  }
}

