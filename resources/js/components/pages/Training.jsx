import React from 'react';
import QuestionCard from "../QuestionCard";
import {useSnackbar} from "notistack";
import LinearProgress from "@material-ui/core/LinearProgress";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Cookies from "js-cookie";
import server from '../../server'
import Switch from "@material-ui/core/Switch";
import {isMobile} from "../../helper";

export default function Training(props) {

  const [questions, updateQuestions] = React.useState([]);
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
      {pageHeader()}
      <div className="container Home">
        <div className="row">
          {questions[0] && (
            <QuestionCard
              question={questions[0] || undefined}
              onSubmit={submitAnswer}
              onSkip={() => updateQuestionsBag()}
              message={questionCardMessage}
            />
          )}
          {!questions[0] && (
            <div>
              {questionCardMessage}
            </div>
          )}
        </div>
      </div>
    </>
  );

  function submitAnswer(answer) {
    let submited_question = questions[0];
    let current_questions = Array.from(questions);
    current_questions.shift();
    updateQuestions(current_questions);

    event.preventDefault();
    server.post(
      'question/submit_answer',
      {
        id: submited_question.id,
        answer: answer,
        mode: "soft",
        is_golden_card: submited_question.is_golden_card,
        is_reverse_question: submited_question.is_reverse,
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
    let questions_in_bag = '';
    questions.forEach((question, index) => {
      questions_in_bag += index === 0 ? '/' : '';
      questions_in_bag += question.id;
      questions_in_bag += index < questions.length - 1 ? ',' : '';
    });

    server.get('question/' + props.mode + questions_in_bag).then(response => {
      questions.shift();
      response.data.questions && updateQuestions(questions.concat(response.data.questions));
      updateQuestionCardMessage(response.data.message);
      updateUserProgress(response.data.userProgress);
    })
  }

  function pageHeader() {

    const user_progress = userProgress && (
      <div className="daily_progress">
        <p className="daily-progress__counter"><span className="hide_on_small">Progression journalière: </span>{userProgress.daily_progress} / {userProgress.daily_objective}</p>
        <LinearProgress variant="determinate" value={userProgress.daily_progress/userProgress.daily_objective * 100} />
      </div>
    );

    return props.mode === "soft" ? (
      <>
        {!isMobile() && (
          <div className="jumbotron Home__title">
            <h1>Mode consolidation</h1>
            <p>Répondez aux questions en fonction du temps passé pour consolider vos mémorisations</p>
            <p>Seules les questions auxquelles vous n'avez pas répondu depuis assez longtemps apparaîtront</p>
            <div className="hide_on_small">
              {user_progress}
            </div>
          </div>
        )}
        {isMobile() && (
          <h2 className="Home__title">Mode consolidation</h2>
        )}
      </>
    )
    : (
      <>
        {!isMobile() && (
          <div className="jumbotron Home__title">
            <h1>Mode tempête !</h1>
            <p>Répondez à un maximum de question toutes catégories confondues sans limite de temps ni d'essai</p>
            <p>Attention, en mode tempête les questions ne rapportent que 10 points chacunes !</p>
            {props.is_connected && (
              <FormControlLabel
                control={
                  <Switch checked={switchStatus} onChange={() => setSwitchStatus(!switchStatus)}/>
                }
                label="Afficher seulement mes questions"
              />
            )}
          </div>
        )}
        {isMobile() && (
          <h2 className="Home__title">Mode tempête !</h2>
        )}
      </>
    )
  }
}

