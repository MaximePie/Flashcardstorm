import React from 'react';
import QuestionCard from "../QuestionCard";
import server from '../../server'
import {useSnackbar} from "notistack";
import LinearProgress from "@material-ui/core/LinearProgress";
import Cookies from "js-cookie";
import moment from "moment";

export default function SoftTraining(props) {
  const [question, updateQuestions] = React.useState(undefined);
  const [questionCardMessage, updateQuestionCardMessage] = React.useState(undefined);
  const [userProgress, updateUserProgress] = React.useState(undefined);

  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  React.useEffect(() => {
    Cookies.remove('number_of_new_questions');
    server.get('update_progress').then(response => {
      updateQuestionsBag()
    })
  }, []);
  return (
    <>
      <div className="jumbotron Home__title">
        <h1>Mode consolidation</h1>
        <p>Répondez aux questions en fonction du temps passé pour consolider vos mémorisations</p>
        <p>Seules les questions auxquelles vous n'avez pas répondu depuis assez longtemps apparaîtront</p>
        {userProgress && (
          <div>
            Progression journalière: {userProgress.daily_progress} / {userProgress.daily_objective}
            <LinearProgress variant="determinate" value={userProgress.daily_progress/userProgress.daily_objective * 100} />
          </div>
        )}
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

  function submitAnswer(answer) {
    event.preventDefault();
    server.post(
      'question/submit_answer',
      {
        id: question.id,
        answer: answer,
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
      updateUserProgress(response.data.userProgress);
    })
  }
}

